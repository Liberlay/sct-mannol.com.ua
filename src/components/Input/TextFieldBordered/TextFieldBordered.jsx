import clsx from 'clsx'
import { useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'

import styles from './TextFieldBordered.module.scss'

export const TextFieldBordered = ({
  type,
  name,
  placeholder,
  validation,
  value,
  onInput,
  min,
  required,
}) => {
  const [isChanged, setIsChanged] = useState(false)
  const isValid = (!validation || !!value.match(validation[0])) && (!required || !!value)
  useUpdateEffect(() => {
    setIsChanged(true)
  }, [value])

  return (
    <div className={styles.wrapper}>
      <input
        className={clsx(styles.input, !isValid && 'notValid')}
        {...{ type, name, placeholder, value, onInput, min, required }}
      />
      <div className={styles.validationError}>
        {validation && !isValid && isChanged && validation[1]}
      </div>
    </div>
  )
}
