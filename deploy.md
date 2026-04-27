# Deploy — Pulsar RH

Guia passo a passo para colocar a aplicação no ar e deixar o agente do Make pronto para receber requisições em produção.

A arquitetura é simples:

```
[Browser do usuário] → [App React/Vite hospedado] → [Webhook Make.com] → [Google Gemini] → resposta
```

Por isso o deploy tem **duas frentes** que precisam ser feitas em ordem:

1. **Publicar o agente no Make.com** (gera a URL pública do webhook).
2. **Publicar o frontend** (que consome essa URL via `VITE_MAKE_WEBHOOK_URL`).

---

## Parte 1 — Publicar o agente no Make.com

O cenário do Make **é** o "agente". Não há servidor próprio: o Make hospeda o fluxo, expõe a URL do webhook e cobra apenas as execuções (operations).

### 1.1 Confirme que o cenário está completo

Antes de publicar, abra o cenário no Make e confira que os três módulos estão configurados conforme descrito no [README.md](README.md):

- Webhooks → Custom webhook (com URL gerada)
- Google Gemini AI → Generate a response (com System Prompt e mapeamento de campos)
- Webhooks → Webhook response (status 200, body JSON com `success` e `mensagem`)

### 1.2 Rode um teste de ponta a ponta

No editor do Make, clique em **Run once** e dispare uma requisição de teste (pode ser via Postman, `curl` ou o próprio formulário rodando local). Verifique:

- O webhook recebeu o payload com os campos esperados (`nomeCargo`, `temaAssunto`, `tipoTexto`, `tomVoz`).
- O Gemini retornou texto.
- A resposta saiu no formato `{ "success": true, "mensagem": "..." }`.

Se algum módulo falhar, corrija antes de ativar — em produção os erros não param para você revisar.

### 1.3 Ative o cenário

No canto inferior esquerdo do editor:

- Ligue o toggle **ON**.
- Confirme que o agendamento está como **Immediately as data arrives** (e não em intervalos).

A partir desse momento o webhook responde 24/7 enquanto houver saldo de operations na sua conta Make.

### 1.4 Copie a URL pública do webhook

No módulo Webhook, copie a URL no formato:

```
https://hook.eu2.make.com/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Essa URL vai para a variável `VITE_MAKE_WEBHOOK_URL` do frontend. Trate-a como segredo: quem tiver a URL consegue disparar execuções e consumir suas operations.

### 1.5 (Recomendado) Configure limites e alertas

Ainda no Make:

- Defina um **Maximum number of consecutive errors** baixo (ex.: 3) para o cenário pausar sozinho em caso de falha em massa.
- Em **Settings da organização**, ative notificações por e-mail quando o consumo de operations passar de um limite.

---

## Parte 2 — Publicar o frontend

O projeto já está preparado para GitHub Pages (existe `.github/workflows/deploy.yml` e `vite.config.ts` com `base: '/pulsarRH/'`). Abaixo a opção principal e duas alternativas.

### Opção A — GitHub Pages (já configurado)

Esse é o caminho mais direto, porque o workflow e o `base` do Vite já estão prontos.

**A.1. Garanta que o secret existe no GitHub**

No repositório: **Settings → Secrets and variables → Actions → New repository secret**

- Name: `VITE_MAKE_WEBHOOK_URL`
- Secret: a URL copiada na etapa 1.4

Sem esse secret o build até passa, mas o app vai para produção sem URL e nenhum formulário funciona.

**A.2. Permissões do Actions**

**Settings → Actions → General → Workflow permissions** → marque **Read and write permissions** e salve. Sem isso o `peaceiris/actions-gh-pages` não consegue criar a branch `gh-pages`.

**A.3. Ajuste o `base` do Vite (se for fork)**

Em [vite.config.ts](vite.config.ts), o campo `base` precisa bater com o nome do repositório:

```ts
base: '/nome-do-seu-repositorio/',
```

Se você manteve o nome `pulsarRH`, não precisa mexer.

**A.4. Push na main**

```bash
git push origin main
```

O workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) é disparado automaticamente em pushes na `main`. Acompanhe a execução em **Actions**.

**A.5. Ative o GitHub Pages**

**Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `gh-pages` / `(root)`** → Save.

Após 1–2 min, o site aparece em:

```
https://<seu-usuario>.github.io/<nome-do-repo>/
```

**A.6. Teste em produção**

Abra o site, preencha o formulário e confirme que a resposta chega. Se travar:

- Abra o DevTools → Network → veja se a chamada para o webhook do Make retorna 200.
- 401/404 → secret errado ou cenário do Make desligado.
- CORS → conferir se a resposta do Make tem header CORS liberado (o módulo Webhook response do Make já libera por padrão).

### Opção B — Vercel

Útil se quiser domínio próprio fácil ou builds mais rápidos.

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Vite**.
3. Em **Environment Variables**, adicione `VITE_MAKE_WEBHOOK_URL` com a URL do Make.
4. Antes do primeiro deploy, **mude o `base` do Vite para `'/'`** em [vite.config.ts](vite.config.ts) — Vercel serve a partir da raiz, não de subpath.
5. Deploy.

### Opção C — Netlify

Mesmo princípio da Vercel.

1. **Add new site → Import from Git**.
2. Build command: `npm run build`. Publish directory: `dist`.
3. Em **Site settings → Environment variables**, adicione `VITE_MAKE_WEBHOOK_URL`.
4. Ajuste `base: '/'` no [vite.config.ts](vite.config.ts).
5. Deploy.

---

## Checklist final

Antes de divulgar a URL pública:

- [ ] Cenário do Make está **ON** e em **Immediately as data arrives**.
- [ ] `VITE_MAKE_WEBHOOK_URL` está definido no ambiente de produção (secret do GitHub, env da Vercel/Netlify).
- [ ] `base` do Vite bate com o caminho de hospedagem (`/pulsarRH/` no GitHub Pages, `/` em Vercel/Netlify).
- [ ] Teste real feito pelo formulário em produção, com resposta gerada pelo Gemini.
- [ ] Saldo de operations do Make e cota da API do Gemini conferidos.

---

## Atualizações futuras

- **Mudou código do frontend:** push na `main` → workflow do GitHub Pages refaz o deploy. Em Vercel/Netlify, o deploy é automático por commit.
- **Mudou o cenário do Make:** edite, rode um **Run once** de teste e o cenário continua no ar com a mesma URL — o frontend não precisa de novo deploy.
- **Trocou a URL do webhook (raro):** atualize o secret `VITE_MAKE_WEBHOOK_URL` e refaça o build/deploy do frontend, porque a URL é embutida em tempo de build pelo Vite.
