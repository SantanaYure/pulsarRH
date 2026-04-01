import { useState } from 'react'

import styles from './MessageGeneratorSection.module.css'
import { MessageForm, type MessageFormData } from '../MessageForm'

export function MessageGeneratorSection() {
  const [submittedData, setSubmittedData] = useState<MessageFormData | null>(null)

  async function handleMessageSubmit(formData: MessageFormData) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSubmittedData(formData)
    console.log('Payload pronto para envio ao Make:', formData)
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
          <div className={styles.preview}>
            <h3 className={styles.previewTitle}>Ultimo envio preparado</h3>
            <dl className={styles.previewList}>
              <div className={styles.previewItem}>
                <dt>Email</dt>
                <dd>{submittedData.email}</dd>
              </div>
              <div className={styles.previewItem}>
                <dt>Nome e cargo</dt>
                <dd>{submittedData.nomeCargo}</dd>
              </div>
              <div className={styles.previewItem}>
                <dt>Tema ou assunto</dt>
                <dd>{submittedData.temaAssunto}</dd>
              </div>
              <div className={styles.previewItem}>
                <dt>Tipo de texto</dt>
                <dd>{submittedData.tipoTexto}</dd>
              </div>
              <div className={styles.previewItem}>
                <dt>Tom de voz</dt>
                <dd>{submittedData.tomVoz}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  )
}