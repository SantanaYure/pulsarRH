import type { MessageFormData, SubmissionPreviewField } from './types'

export const textTypeOptions = [
  'E-mail corporativo',
  'Resumo da reunião',
  'Mensagem para whatsapp',
  'Aviso institucional',
] as const

export const toneOptions = [
  'Formal',
  'Informal',
  'Urgente',
  'Acolhedor',
] as const

export const initialMessageFormData: MessageFormData = {
  email: '',
  nomeCargo: '',
  temaAssunto: '',
  tipoTexto: '',
  tomVoz: '',
}

export const submissionPreviewFields: SubmissionPreviewField[] = [
  { key: 'email', label: 'Email' },
  { key: 'nomeCargo', label: 'Nome e cargo' },
  { key: 'temaAssunto', label: 'Tema ou assunto' },
  { key: 'tipoTexto', label: 'Tipo de texto' },
  { key: 'tomVoz', label: 'Tom de voz' },
]