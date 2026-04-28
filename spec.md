# Pulsar RH — Especificação do Sistema

## Visão Geral

Pulsar RH é uma aplicação web que permite a profissionais de RH e colaboradores gerar comunicações corporativas profissionais com auxílio de Inteligência Artificial. O usuário preenche um formulário descrevendo o contexto e as preferências de estilo, e o sistema retorna um texto pronto, gerado pelo Google Gemini, via Make.com.

---

## Tecnologias

### Frontend

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19.2.4 | Biblioteca de UI baseada em componentes |
| TypeScript | ~5.9.3 | Tipagem estática e segurança em desenvolvimento |
| Vite | 8.0.1 | Bundler e servidor de desenvolvimento |
| CSS Modules | — | Estilos escopados por componente |

### Ferramentas de Desenvolvimento

- **ESLint 9** com `typescript-eslint` e `eslint-plugin-react-hooks` — linting e qualidade de código
- **GitHub Actions** — CI/CD automatizado com deploy a cada push na branch `main`
- **GitHub Pages** — hospedagem estática gratuita para a SPA

### Serviços Externos

| Serviço | Papel |
|---|---|
| Make.com | Orquestrador de automação — recebe os dados do formulário via webhook, chama o Gemini e devolve a mensagem gerada |
| Google Gemini 2.5 Flash | Modelo de IA generativa responsável por criar o texto |
| Cloudinary | CDN para servir o logo da aplicação |

---

## Funcionalidades

### Geração de Mensagem

O usuário preenche cinco campos:

| Campo | Tipo | Descrição |
|---|---|---|
| E-mail | Input texto | Identificação do solicitante |
| Nome e Cargo | Input texto | Quem está comunicando e sua função |
| Tema ou Assunto | Input texto | Contexto da mensagem |
| Tipo de Texto | Radio button | Email / Resumo de Reunião / WhatsApp / Aviso Institucional |
| Tom de Voz | Radio button | Formal / Informal / Urgente / Acolhedor |

Ao submeter, o sistema envia esses dados ao Make.com, aguarda o processamento pelo Gemini e exibe o texto gerado diretamente no formulário.

### Feedback Visual

- Botão de submit desabilitado durante o carregamento (estado `loading`)
- Mensagem de sucesso em destaque (ciano) ao receber a resposta
- Mensagem de erro em destaque (vermelho) em caso de falha, com descrição do problema

### Design Responsivo

Interface em tema escuro com gradiente azul/ciano, adaptada para mobile a partir de 640px de largura. Tipografia fluida via `clamp()`.

---

## Lógica e Arquitetura

### Hierarquia de Componentes

```
App
├── Logo
└── MessageGeneratorSection       ← instancia o serviço e gerencia estado principal
    └── MessageForm               ← UI do formulário + exibição do resultado
```

### Fluxo de Dados

```
Usuário preenche formulário
    ↓
handleChange → atualiza formData (estado local via useMessageForm)
    ↓
handleSubmit → chama messageSubmissionService.submit(formData)
    ↓
fetch POST → Make webhook URL (variável de ambiente VITE_MAKE_WEBHOOK_URL)
    ↓
Resposta JSON → parseada por extractMensagem / toMessageString
    ↓
setResultado(mensagem) ou setErro(mensagem)
    ↓
UI re-renderiza com o resultado
```

### Gerenciamento de Estado

Toda a lógica de formulário fica no hook customizado `useMessageForm`:

- `formData` — valores dos campos
- `loading` — controla o estado do botão durante a requisição
- `resultado` — texto gerado com sucesso
- `erro` — mensagem de erro

### Padrão de Serviço

A integração com o Make segue um padrão de serviço com injeção de dependência:

- `MessageSubmissionService` — interface que define o contrato
- `MakeWebhookSubmissionService` — implementação concreta
- `createMakeWebhookSubmissionService()` — factory que instancia com a URL do ambiente

Isso permite trocar a integração futuramente sem alterar os componentes.

### Tratamento de Resposta Robusto

O Make pode retornar a mensagem gerada em formatos variados dependendo da versão do cenário ou do modelo. O serviço implementa múltiplas estratégias de extração em cadeia:

1. Tenta campo `mensagem` via `JSON.parse` padrão
2. Tenta extração de string com aspas: `"mensagem": "..."`
3. Tenta extração sem aspas: `"mensagem": ...}`
4. Tenta fazer `JSON.parse` do valor se parecer JSON aninhado
5. Converte para string como último recurso

Se nenhuma estratégia encontrar o campo esperado, o erro informa quais campos foram recebidos, facilitando o diagnóstico.

---

## Comunicação com o Make

### Como funciona

O frontend faz uma única requisição HTTP `POST` ao webhook do Make:

```
POST https://hook.eu2.make.com/<id-do-webhook>
Content-Type: application/json

{
  "email": "...",
  "nomeCargo": "...",
  "temaAssunto": "...",
  "tipoTexto": "...",
  "tomVoz": "..."
}
```

O cenário no Make tem três módulos em sequência:

```
[1] Custom Webhook  →  [2] Google Gemini  →  [3] Webhook Response
```

O módulo Gemini recebe os campos mapeados via variáveis do Make (`{{1.nomeCargo}}`, `{{1.temaAssunto}}`, etc.) e um system prompt fixo que instrui o modelo a:

- Adaptar o formato ao tipo de texto (email com saudação/assinatura, WhatsApp direto, etc.)
- Respeitar o tom de voz solicitado
- Escrever em português (Brasil)
- Não inventar informações — usar apenas o contexto fornecido
- Retornar texto corrido, sem listas ou marcadores

A resposta do Make ao frontend é:

```json
{ "success": true, "mensagem": "<texto gerado pelo Gemini>" }
```

### Por que esse método foi escolhido

**1. A chave da API do Gemini não fica exposta no frontend.**
Se o frontend chamasse o Gemini diretamente, a API key seria visível no bundle JavaScript de qualquer pessoa que inspecionasse o código. Com o Make como intermediário, a credencial fica armazenada de forma segura no servidor da plataforma.

**2. Simplicidade de backend sem gerenciar servidor.**
Make elimina a necessidade de criar e manter uma API própria (Node, Python, etc.), um servidor, deploy separado ou custos de infraestrutura. Todo o fluxo de integração é configurado visualmente no cenário.

**3. Webhook síncrono com resposta imediata.**
O Make suporta webhooks que aguardam o processamento do cenário antes de responder (modo "Respond immediately" desativado). Isso permite que o frontend faça um único `fetch` e aguarde o resultado sem polling ou soluções de tempo real.

**4. Facilidade de evoluir o fluxo de automação.**
Precisa logar submissões num banco, enviar e-mail de confirmação, ou trocar o modelo de IA? Basta adicionar módulos no cenário do Make sem tocar no código do frontend.

**5. Blueprint versionado no repositório.**
O arquivo `make/pulsar-rh-blueprint.json.json` permite recriar o cenário em qualquer conta Make com um único import, garantindo rastreabilidade e portabilidade da automação junto ao código.

---

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `VITE_MAKE_WEBHOOK_URL` | URL completa do webhook do Make. Deve ser configurada como secret no repositório GitHub para o build de produção. |

---

## Deploy

O processo de deploy é totalmente automatizado via GitHub Actions:

1. Push na branch `main`
2. Workflow instala dependências e executa `npm run build` com a variável de ambiente injetada
3. O Vite compila o TypeScript e empacota os assets com o `base` configurado para `/pulsarRH/`
4. O artefato `dist/` é publicado na branch `gh-pages`
5. GitHub Pages serve a aplicação em `https://santanayure.github.io/pulsarRH/`
