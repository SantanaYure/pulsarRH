import { useState, type ChangeEvent, type FormEvent } from 'react'

import { initialMessageFormData } from '../constants'
import type {
  MessageFormData,
  MessageFormSubmitHandler,
  MessageSubmissionResult,
} from '../types'

export function useMessageForm(onSubmitForm?: MessageFormSubmitHandler) {
  const [formData, setFormData] = useState<MessageFormData>(
    initialMessageFormData,
  )
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState('')
  const [erro, setErro] = useState('')

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setResultado('')
    setErro('')

    try {
      const response: MessageSubmissionResult | undefined = await onSubmitForm?.(
        formData,
      )

      setResultado(response?.mensagem || 'Dados enviados com sucesso ao Make.')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Nao foi possivel preparar os dados para envio.'

      setErro(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    erro,
    formData,
    handleChange,
    handleSubmit,
    loading,
    resultado,
  }
}