import type {
  MessageFormData,
  MessageSubmissionResult,
  MessageSubmissionService,
} from '../types'

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

      if (response.status === 404) {
        throw new Error(
          'O webhook do Make retornou 404. Verifique se a URL esta correta e se o webhook esta ativo.',
        )
      }

      if (!response.ok) {
        throw new Error(
          `O Make respondeu com status ${response.status}. Verifique a configuracao do webhook.`,
        )
      }

      const responseData = (await response.json()) as Partial<MessageSubmissionResult>

      if (!responseData.success) {
        throw new Error(
          responseData.mensagem ||
            'O Make respondeu sem confirmar sucesso no processamento.',
        )
      }

      if (typeof responseData.mensagem !== 'string' || !responseData.mensagem.trim()) {
        throw new Error('O Make respondeu sem a mensagem esperada.')
      }

      return {
        success: true,
        mensagem: responseData.mensagem,
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