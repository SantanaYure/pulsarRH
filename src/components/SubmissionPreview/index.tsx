import styles from './SubmissionPreview.module.css'
import { submissionPreviewFields } from '../../features/message-generator/constants'
import type { MessageFormData } from '../../features/message-generator/types'

type SubmissionPreviewProps = {
  data: MessageFormData
  mensagem?: string
}

export function SubmissionPreview({ data, mensagem }: SubmissionPreviewProps) {
  return (
    <div className={styles.preview}>
      <h3 className={styles.previewTitle}>Ultimo envio preparado</h3>
      <dl className={styles.previewList}>
        {submissionPreviewFields.map(({ key, label }) => (
          <div key={key} className={styles.previewItem}>
            <dt>{label}</dt>
            <dd>{data[key]}</dd>
          </div>
        ))}
      </dl>

      {mensagem ? (
        <div className={styles.messageBox}>
          <h4 className={styles.messageTitle}>Mensagem retornada</h4>
          <p className={styles.messageContent}>{mensagem}</p>
        </div>
      ) : null}
    </div>
  )
}