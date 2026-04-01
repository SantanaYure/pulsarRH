import { useState } from 'react'

import styles from './MessageGeneratorSection.module.css'
import { MessageForm } from '../MessageForm'
import { SubmissionPreview } from '../SubmissionPreview'
import { createMockMessageSubmissionService } from '../../features/message-generator/services/messageSubmissionService'
import type { MessageFormData } from '../../features/message-generator/types'

const submissionService = createMockMessageSubmissionService()

export function MessageGeneratorSection() {
  const [submittedData, setSubmittedData] = useState<MessageFormData | null>(null)

  async function handleMessageSubmit(formData: MessageFormData) {
    await submissionService.submit(formData)
    setSubmittedData(formData)
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

        {submittedData ? <SubmissionPreview data={submittedData} /> : null}
      </div>
    </section>
  )
}