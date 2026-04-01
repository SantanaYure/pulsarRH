import type {
  MessageFormData,
  MessageSubmissionService,
} from '../types'

class MockMessageSubmissionService implements MessageSubmissionService {
  constructor(private readonly delayMs: number) {}

  async submit(formData: MessageFormData): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, this.delayMs))
    console.log('Payload pronto para envio ao Make:', formData)
  }
}

export function createMockMessageSubmissionService(
  delayMs = 500,
): MessageSubmissionService {
  return new MockMessageSubmissionService(delayMs)
}