import { useState } from 'react'

import styles from './MessageGeneratorSection.module.css'
import { MessageForm } from '../MessageForm'
import { SubmissionPreview } from '../SubmissionPreview'
import { createMakeWebhookSubmissionService } from '../../features/message-generator/services/messageSubmissionService'
import type {
  MessageFormData,
  MessageSubmissionResult,
} from '../../features/message-generator/types'

const submissionService = createMakeWebhookSubmissionService()

export function MessageGeneratorSection() {
  const [submittedData, setSubmittedData] = useState<MessageFormData | null>(null)
  const [submissionResult, setSubmissionResult] =
    useState<MessageSubmissionResult | null>(null)

  async function handleMessageSubmit(formData: MessageFormData) {
    const response = await submissionService.submit(formData)
    setSubmittedData(formData)
    setSubmissionResult(response)

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

        {submittedData ? (
          <SubmissionPreview data={submittedData} mensagem={submissionResult?.mensagem} />
        ) : null}
      </div>
    </section>
  )
}