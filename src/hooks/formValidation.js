import { useEffect, useRef, useState } from 'react'

export const useFormValidation = (inputValue) => {
  const formRef = useRef()
  const [isValid, setIsValid] = useState(false)
  useEffect(() => {
    setIsValid(!formRef.current?.querySelector('.notValid'))
  }, [inputValue])

  return [formRef, isValid]
}
