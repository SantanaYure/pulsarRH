import type { FormEvent } from 'react'

import styles from './MessageForm.module.css'

const textTypeOptions = ['E-mail corporativo', 'Resumo da reunião', 'Mensagem para whatsapp', 'Aviso institucional']
const toneOptions = ['Formal', 'Informal', 'Urgente', 'Acolhedor']

export function MessageForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Email *</span>
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="seuemail@empresa.com"
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Nome e cargo *</span>
        <input
          className={styles.input}
          type="text"
          name="nameAndRole"
          placeholder="Ex.: Ana Silva, RH"
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Tema ou assunto *</span>
        <textarea
          className={styles.textarea}
          name="subject"
          placeholder="Descreva o contexto da mensagem"
          rows={4}
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
                name="textType"
                value={option}
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
                name="tone"
                value={option}
                required
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button className={styles.submit} type="submit">
        GERAR MENSAGEM
      </button>
    </form>
  )
}