import clsx from 'clsx'
import SimpleBar from 'simplebar-react'
import { useState, useEffect } from 'react'
import { cloneElement, useRef } from 'react'
import { useOnClickAway } from '../../../hooks/useOnClickAway'

import ClearIcon from '@mui/icons-material/Clear'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import styles from './Select.module.scss'

export const Select = ({
  title,
  def,
  options,
  value,
  onChange,
  inputIsVisible,
  loading,
  required,
}) => {
  const inputRef = useRef()
  const selectRef = useRef()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useOnClickAway(selectRef, open, () => setOpen(false))

  const onChangeInput = (event) => {
    setInputValue(event.target.value.toLowerCase())
  }

  const onClickClear = () => {
    setInputValue('')
    inputRef.current.focus()
  }

  useEffect(() => {
    open && inputRef.current.focus()
  }, [open])

  return (
    <div className={styles.wrapper} ref={selectRef}>
      <div>{title}</div>
      <div
        className={clsx(styles.selected, required && !value && 'notValid')}
        onClick={() => setOpen(!open)}>
        {options.find((option) => option.key === value) ? (
          options.map(
            (option, i) =>
              option.key === value && (
                <div key={i} className={styles.textWrapper}>
                  {option.icon && cloneElement(option.icon, { className: styles.icon })}
                  <div className={styles.selectedProvider}>{option.text}</div>
                </div>
              ),
          )
        ) : (
          <div>{def}</div>
        )}
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </div>
      {open && (
        <div className={styles.selector}>
          <div className={clsx(styles.selectorInput, !inputIsVisible && styles.hidden)}>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              placeholder="Пошук"
              value={inputValue}
              onChange={onChangeInput}
            />
            {inputValue && (
              <ClearIcon className={styles.clearIcon} onClick={() => onClickClear()} />
            )}
          </div>
          {loading ? (
            <div className={styles.loading}>Завантаження...</div>
          ) : (
            <SimpleBar style={{ maxHeight: 180 }}>
              {options
                .filter((option) =>
                  !inputValue ? true : option.text.toLowerCase().includes(inputValue),
                )
                .map((option, i) => (
                  <div
                    key={i}
                    className={styles.selectorItem}
                    onClick={() => (onChange(option.key), setOpen(false))}>
                    {option.icon && cloneElement(option.icon, { className: styles.icon })}
                    <div>{option.text}</div>
                  </div>
                ))}
            </SimpleBar>
          )}
        </div>
      )}
    </div>
  )
}
