'use client'

import { useState } from 'react'
import { auth } from 'utils/auth'
import { toast } from 'react-toastify'
import { request } from 'utils/request'
import { Input } from 'components/Input'
import { Modals } from 'components/Modals'
import { useSelector } from 'react-redux'
import { notifyError } from 'utils/errors'
import { Button } from 'components/Button/Button'
import { useFormValidation } from 'hooks/formValidation'
import { inputValidations } from 'utils/inputValidations'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import styles from './Credentials.module.scss'

export const Credentials = () => {
  const user = useSelector((state) => state.auth.user)
  const [value, setValue] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  })
  const [open, setOpen] = useState(false)
  const [formRef, isValid] = useFormValidation(value)

  return (
    <div className={styles.container}>
      <form ref={formRef} className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.top}>
          <Input.TextField
            title="Ім’я"
            type="text"
            name="firstName"
            validation={[inputValidations.name, "Поле повинно містити ім'я"]}
            value={value.firstName}
            onInput={(event) => setValue({ ...value, firstName: event.target.value })}
            required
          />
          <Input.TextField
            title="Прізвище"
            type="text"
            name="lastName"
            validation={[inputValidations.name, 'Поле повинно містити прізвище']}
            value={value.lastName}
            onInput={(event) => setValue({ ...value, lastName: event.target.value })}
            required
          />
        </div>
        <Input.TextField
          title="Email"
          type="email"
          name="email"
          validation={[inputValidations.email, 'Поле повинно містити email']}
          value={value.email}
          onInput={(event) => setValue({ ...value, email: event.target.value })}
          required
        />
        <Input.TextField
          title="Телефон"
          type="tel"
          name="tel"
          validation={[inputValidations.phone, 'Поле повинно містити телефон']}
          value={value.phone}
          onInput={(event) => setValue({ ...value, phone: event.target.value })}
          required
        />
      </form>
      <div className={styles.changePassword} onClick={() => setOpen(!open)}>
        Змінити пароль
        <ChevronRightIcon />
      </div>
      <Modals.ChangePassword isOpen={open} setIsOpen={setOpen} />
      <Button
        type={'aligned'}
        notValid={!isValid}
        text={'Зберегти зміни'}
        onClick={() => {
          request
            .authorized({
              url: `/@me`,
              method: 'patch',
              data: {
                firstName: value.firstName,
                lastName: value.lastName,
                email: value.email,
                phone: value.phone,
              },
            })
            .then((data) => (auth.setUser(data), toast('Зміни збережено')))
            .catch(notifyError)
        }}
      />
    </div>
  )
}
