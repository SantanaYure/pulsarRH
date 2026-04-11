import type {
  MessageFormData,
  MessageSubmissionResult,
  MessageSubmissionService,
} from '../types'

type MakeWebhookResponse = Partial<MessageSubmissionResult> & {
  message?: unknown
  resultado?: unknown
  data?: unknown
}

function extractMensagemFromRawText(rawText: string): string {
  // Valor entre aspas: "mensagem": "..."
  const quotedMatch = rawText.match(/"mensagem"\s*:\s*"((?:[^"\\]|\\.)*)"/s)
  if (quotedMatch?.[1]?.trim()) {
    return quotedMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').trim()
  }

  // Valor sem aspas: "mensagem": Texto livre até o } final
  const unquotedMatch = rawText.match(/"mensagem"\s*:\s*([\s\S]+)/)
  if (unquotedMatch?.[1]) {
    return unquotedMatch[1].replace(/\s*\}[\s\n]*$/, '').trim()
  }

  return ''
}

function toMessageString(value: unknown): string {
  if (value == null) return ''

  if (typeof value === 'string') {
    const trimmed = value.trim()

    // Valor é um JSON aninhado — extrair campo de mensagem internamente
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const nested: unknown = JSON.parse(trimmed)
        const obj = Array.isArray(nested) ? (nested as unknown[])[0] : nested

        if (obj && typeof obj === 'object') {
          const record = obj as Record<string, unknown>
          const candidate =
            record['mensagem'] ?? record['message'] ?? record['resultado']

          if (typeof candidate === 'string') return candidate.trim()
        }
      } catch {
        // Não é JSON válido — usa como texto simples
      }
    }

    return trimmed
  }

  if (typeof value === 'object') {
    // Objeto direto: extrai campo de mensagem sem serializar
    const record = value as Record<string, unknown>
    const candidate =
      record['mensagem'] ?? record['message'] ?? record['resultado']

    if (typeof candidate === 'string') return candidate.trim()
  }

  return String(value)
}

function extractMensagem(responseData: MakeWebhookResponse): string {
  const data: MakeWebhookResponse = Array.isArray(responseData)
    ? (responseData as MakeWebhookResponse[])[0]
    : responseData

  return (
    toMessageString(data.mensagem) ||
    toMessageString(data.message) ||
    toMessageString(data.resultado) ||
    toMessageString(data.data)
  )
}

class MakeWebhookSubmissionService implements MessageSubmissionService {
  private readonly webhookUrl: string

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl
  }

  async submit(formData: MessageFormData): Promise<MessageSubmissionResult> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const rawResponse = await response.text()
      console.log('Resposta bruta do Make:', rawResponse)

      if (response.status === 404) {
        throw new Error(
          'O webhook do Make retornou 404. Verifique se a URL esta correta e se o webhook esta ativo.',
        )
      }

      let responseData: MakeWebhookResponse | null = null

      try {
        responseData = JSON.parse(rawResponse) as MakeWebhookResponse
      } catch {
        if (response.ok && rawResponse.trim()) {
          const extracted = extractMensagemFromRawText(rawResponse)
          return {
            success: true,
            mensagem: extracted || rawResponse.trim(),
          }
        }

        throw new Error('O Make respondeu, mas nao retornou JSON valido.')
      }

      const mensagem = extractMensagem(responseData)

      if (!response.ok) {
        throw new Error(mensagem || 'Erro ao processar no Make.')
      }

      if (responseData.success === false) {
        throw new Error(
          mensagem || 'O Make respondeu sem confirmar sucesso no processamento.',
        )
      }

      if (!mensagem) {
        const availableKeys = Object.keys(responseData)

        throw new Error(
          availableKeys.length > 0
            ? `O Make respondeu sem a mensagem esperada. Campos recebidos: ${availableKeys.join(', ')}.`
            : 'O Make respondeu sem a mensagem esperada.',
        )
      }

      return {
        success: true,
        mensagem,
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          'Nao foi possivel conectar ao Make. Verifique a URL do webhook, a conexao e possiveis bloqueios de rede.',
        )
      }

      throw error
    }
  }
}

function getMakeWebhookUrl(): string {
  const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL?.trim()

  if (!webhookUrl) {
    throw new Error('A variavel VITE_MAKE_WEBHOOK_URL nao foi configurada.')
  }

  return webhookUrl
}

export function createMakeWebhookSubmissionService(): MessageSubmissionService {
  return new MakeWebhookSubmissionService(getMakeWebhookUrl())
}