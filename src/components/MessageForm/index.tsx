import styles from './MessageForm.module.css'
import {
  textTypeOptions,
  toneOptions,
} from '../../features/message-generator/constants'
import { useMessageForm } from '../../features/message-generator/hooks/useMessageForm'
import type {
  MessageFormData,
  MessageFormSubmitHandler,
} from '../../features/message-generator/types'

type MessageFormProps = {
  onSubmitForm?: MessageFormSubmitHandler
}

export function MessageForm({ onSubmitForm }: MessageFormProps) {
  const {
    feedbackMessage,
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useMessageForm(onSubmitForm)

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Email *</span>
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="seuemail@empresa.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Nome e cargo *</span>
        <input
          className={styles.input}
          type="text"
          name="nomeCargo"
          placeholder="Ex.: Ana Silva, RH"
          value={formData.nomeCargo}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Tema ou assunto *</span>
        <textarea
          className={styles.textarea}
          name="temaAssunto"
          placeholder="Descreva o contexto da mensagem"
          rows={4}
          value={formData.temaAssunto}
          onChange={handleChange}
          required
        />
      </label>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Tipo de texto *</legend>
        <div className={`${styles.options} ${styles.optionsColumn}`}>
          {textTypeOptions.map((option) => (
            <label key={option} className={`${styles.option} ${styles.optionPlain}`}>
              <input
                className={styles.radio}
                type="radio"
                name="tipoTexto"
                value={option}
                checked={formData.tipoTexto === option}
                onChange={handleChange}
                required
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Tom de voz *</legend>
        <div className={styles.options}>
          {toneOptions.map((option) => (
            <label key={option} className={styles.option}>
              <input
                className={styles.radio}
                type="radio"
                name="tomVoz"
                value={option}
                checked={formData.tomVoz === option}
                onChange={handleChange}
                required
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'GERANDO...' : 'GERAR MENSAGEM'}
      </button>

      {feedbackMessage ? (
        <p className={styles.feedback}>{feedbackMessage}</p>
      ) : null}
    </form>
  )
}