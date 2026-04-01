import styles from './SubmissionPreview.module.css'
import { submissionPreviewFields } from '../../features/message-generator/constants'
import type { MessageFormData } from '../../features/message-generator/types'

type SubmissionPreviewProps = {
  data: MessageFormData
}

export function SubmissionPreview({ data }: SubmissionPreviewProps) {
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
    </div>
  )
}