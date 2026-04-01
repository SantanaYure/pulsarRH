import { useState, type ChangeEvent, type FormEvent } from 'react'

import { initialMessageFormData } from '../constants'
import type {
  MessageFormData,
  MessageFormSubmitHandler,
} from '../types'

export function useMessageForm(onSubmitForm?: MessageFormSubmitHandler) {
  const [formData, setFormData] = useState<MessageFormData>(
    initialMessageFormData,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

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

    setIsSubmitting(true)
    setFeedbackMessage('')

    try {
      await onSubmitForm?.(formData)
      setFeedbackMessage('Dados preparados para envio ao Make.')
    } catch {
      setFeedbackMessage('Nao foi possivel preparar os dados para envio.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    feedbackMessage,
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
  }
}