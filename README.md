# Pulsar RH

Gerador de mensagens corporativas com IA Generativa. Preencha os dados do formulário e receba em segundos um e-mail, resumo de reunião, mensagem para WhatsApp ou aviso institucional pronto para uso.

**Acesse o projeto:** https://santanayure.github.io/pulsarRH/

---

## Como funciona

O usuário preenche o formulário com nome, cargo, tema, tipo de texto e tom de voz. Esses dados são enviados para um fluxo no Make.com, que chama a API do Google Gemini e devolve a mensagem gerada para a tela.

---

## Pré-requisitos

- Conta no [Make.com](https://www.make.com) (plano gratuito funciona)
- Chave de API do [Google Gemini](https://aistudio.google.com/app/apikey)
- Node.js 22 ou superior
- Git instalado

---

## Configuração do Make.com

O fluxo no Make é responsável por receber os dados do formulário, chamar o Gemini e devolver a mensagem gerada. Siga os passos abaixo para configurar o seu próprio fluxo.

### 1. Criar o cenário

Acesse o Make.com, crie um novo cenário e adicione três módulos em sequência:

```
Webhooks (Custom webhook) → Google Gemini AI (Generate a response) → Webhooks (Webhook response)
```

### 2. Configurar o Custom Webhook

Clique no módulo Webhooks e selecione **Custom webhook**. Clique em **Add** para criar um novo webhook e copie a URL gerada. Você vai precisar dela no próximo passo.

Envie um formulário de teste pela interface para que o Make capture a estrutura dos dados automaticamente.

### 3. Configurar o Google Gemini AI

Clique no módulo Google Gemini AI e configure:

- **Connection:** clique em Add, dê um nome e cole sua chave de API do Google Gemini
- **AI Model:** `gemini-2.5-flash`
- **System Instructions > Add a System Prompt:** cole o conteúdo abaixo

```
Você é um especialista em comunicação corporativa de RH, com foco em clareza, profissionalismo e padronização institucional.

Sua tarefa é gerar uma mensagem corporativa com base nos dados fornecidos.

Antes de escrever, interprete corretamente o contexto e o objetivo da mensagem.

INSTRUÇÕES:
1. Adapte o formato conforme o tipo de texto:
   - E-mail: incluir saudação e fechamento
   - WhatsApp: direto, objetivo e natural
   - Resumo: organizado e claro
   - Aviso institucional: formal e padronizado

2. Ajuste o estilo conforme o tom de voz:
   - Formal: linguagem profissional
   - Informal: linguagem leve e acessível
   - Urgente: direto e com senso de prioridade
   - Acolhedor: empático e humanizado

3. Utilize o tema como base principal da mensagem
4. Não invente informações que não foram fornecidas
5. Mantenha coerência, clareza e objetividade

REGRAS (OBRIGATÓRIAS):
- Escreva em português do Brasil
- Não explique o que você está fazendo
- Não use listas ou tópicos
- Retorne apenas a mensagem final pronta para uso
```

- **Messages > Add item > Message Type:** Text
- **Text:** mapeie os campos do webhook:

```
DADOS DE ENTRADA:
- Nome e cargo: {{nomeCargo}}
- Tema ou assunto: {{temaAssunto}}
- Tipo de texto: {{tipoTexto}}
- Tom de voz: {{tomVoz}}

SAÍDA ESPERADA:
Uma única mensagem completa, pronta para envio.
```

### 4. Configurar o Webhook Response

Clique no módulo Webhook response e configure:

- **Status:** 200
- **Body:**

```json
{
  "success": true,
  "mensagem": {{text do módulo Gemini}}
}
```

No campo `mensagem`, use o mapeador visual do Make para selecionar o campo de texto retornado pelo módulo Gemini.

### 5. Ativar o cenário

Ligue o toggle do cenário para **On** e certifique-se de que está configurado como **Immediately as data arrives**.

---

## Configuração do projeto local

### 1. Clonar o repositório

```bash
git clone https://github.com/SantanaYure/pulsarRH.git
cd pulsarRH
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

Abra o `.env` e cole a URL do webhook criado no Make:

```env
VITE_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/sua-url-aqui
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Deploy no GitHub Pages

### 1. Fazer fork do repositório

Clique em **Fork** no canto superior direito desta página.

### 2. Configurar o secret da URL do webhook

No seu repositório, acesse **Settings > Secrets and variables > Actions > New repository secret** e crie:

- **Name:** `VITE_MAKE_WEBHOOK_URL`
- **Secret:** URL do webhook do Make

### 3. Configurar as permissões do Actions

Acesse **Settings > Actions > General** e em **Workflow permissions** selecione **Read and write permissions**. Salve.

### 4. Ajustar o base no Vite

No arquivo `vite.config.ts`, altere o campo `base` com o nome do seu repositório:

```ts
export default defineConfig({
  plugins: [react()],
  base: '/nome-do-seu-repositorio/',
})
```

### 5. Fazer push para a branch main

```bash
git add .
git commit -m "chore: configure deploy"
git push origin main
```

O workflow vai rodar automaticamente. Acompanhe em **Actions**.

### 6. Ativar o GitHub Pages

Acesse **Settings > Pages**, selecione a branch **gh-pages** como source e salve.

O site estará disponível em `https://seu-usuario.github.io/nome-do-repositorio/`.

---

## Stack

- React 19
- TypeScript
- Vite 8
- CSS Modules
- Make.com
- Google Gemini 2.5 Flash

---

## Licença

MIT
