import styles from './MessageGeneratorSection.module.css'
import { MessageForm } from '../MessageForm'
import { createMakeWebhookSubmissionService } from '../../features/message-generator/services/messageSubmissionService'
import type { MessageFormData } from '../../features/message-generator/types'

const submissionService = createMakeWebhookSubmissionService()

export function MessageGeneratorSection() {
  async function handleMessageSubmit(formData: MessageFormData) {
    const response = await submissionService.submit(formData)

    return response
  }

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title}>Gerador de Mensagens</h2>
          <p className={styles.subtitle}>
            Preencha os campos para estruturar a mensagem que sera gerada.
          </p>
        </header>

        <MessageForm onSubmitForm={handleMessageSubmit} />
      </div>
    </section>
  )
}