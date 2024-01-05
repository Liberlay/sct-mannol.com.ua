'use client'

import { useState } from 'react'
import { request } from 'utils/request'
import { Input } from 'components/Input'
import { Button } from 'components/Button/Button'
import { useFormValidation } from 'hooks/formValidation'
import { inputValidations } from 'utils/inputValidations'

import styles from './PasswordReset.module.scss'
import { notifyError } from 'utils/errors'
import { toast } from 'react-toastify'
import { auth } from 'utils/auth'
import { useRouter } from 'next/navigation'

export const PasswordReset = ({ token }) => {
  const router = useRouter()
  const [value, setValue] = useState({
    password: '',
    confirmation: '',
  })
  const [formRef, isValid] = useFormValidation(value)

  return (
    <div className={styles.container}>
      <div className={styles.title}>Відновлення паролю</div>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.resetPassword}>
          <Input.TextField
            title={'Новий пароль'}
            type={'password'}
            name={'newPassword'}
            validation={[inputValidations.password, 'Поле повинно містити пароль']}
            value={value.password}
            onInput={(event) => setValue({ ...value, password: event.target.value })}
            required
          />
          <Input.TextField
            title={'Підтвердження нового паролю'}
            type={'password'}
            name={'newPasswordConfirm'}
            validation={[inputValidations.password, 'Поле повинно містити пароль']}
            value={value.confirmation}
            onInput={(event) => setValue({ ...value, confirmation: event.target.value })}
            required
          />
          <Button
            type={'aligned'}
            notValid={!isValid || value.password !== value.confirmation}
            text={'Відновити пароль'}
            onClick={() =>
              request
                .unauthorized({
                  url: '/password-recovery/restore',
                  method: 'post',
                  data: {
                    code: token,
                    password: value.password,
                  },
                })
                .then(
                  (data) => (
                    auth.login(data), router.push('/my-account/orders'), toast('Пароль відновлено')
                  ),
                )
                .catch(notifyError)
            }
          />
        </div>
      </form>
    </div>
  )
}
