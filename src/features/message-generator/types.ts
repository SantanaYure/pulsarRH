export type MessageFormData = {
  email: string
  nomeCargo: string
  temaAssunto: string
  tipoTexto: string
  tomVoz: string
}

export type MessageFormFieldName = keyof MessageFormData

export type MessageFormSubmitHandler = (
  formData: MessageFormData,
) => void | Promise<void>

export type SubmissionPreviewField = {
  key: MessageFormFieldName
  label: string
}

export interface MessageSubmissionService {
  submit(formData: MessageFormData): Promise<void>
}