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
      await onSubmitForm?.(formData)
      setResultado('Dados preparados para envio ao Make.')
    } catch {
      setErro('Nao foi possivel preparar os dados para envio.')
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