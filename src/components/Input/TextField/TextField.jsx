import clsx from 'clsx'
import { useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'

import styles from './TextField.module.scss'

export const TextField = ({ title, type, name, validation, value, onInput, required }) => {
  const [isChanged, setIsChanged] = useState(false)
  const isValid = (!validation || !!value.match(validation[0])) && (!required || !!value)
  useUpdateEffect(() => {
    setIsChanged(true)
  }, [value])

  return (
    <div className={styles.inputBlock}>
      <div className={styles.inputTitle}>{title}</div>
      <input
        className={clsx(styles.input, !isValid && 'notValid')}
        {...{ type, name, value, onInput }}
      />
      <div className={styles.validationError}>
        {validation && isChanged && !isValid && validation[1]}
      </div>
    </div>
  )
}
