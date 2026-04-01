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
) => MessageSubmissionResult | Promise<MessageSubmissionResult>

export type SubmissionPreviewField = {
  key: MessageFormFieldName
  label: string
}

export type MessageSubmissionResult = {
  success: boolean
  mensagem: string
}

export interface MessageSubmissionService {
  submit(formData: MessageFormData): Promise<MessageSubmissionResult>
}