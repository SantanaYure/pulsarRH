import styles from './MessageGeneratorSection.module.css'
import { MessageForm } from '../MessageForm'

export function MessageGeneratorSection() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title}>Gerador de Mensagens</h2>
          <p className={styles.subtitle}>
            Preencha os campos para estruturar a mensagem que sera gerada.
          </p>
        </header>

        <MessageForm />
      </div>
    </section>
  )
}