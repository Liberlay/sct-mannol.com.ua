import { useEffect } from 'react'

export const useOnClickAway = (ref, isVisible, onMouseEvent) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.composedPath().includes(ref.current) &&
        !event.target.closest('#modals') &&
        isVisible
      ) {
        onMouseEvent()
      }
    }
    document.body.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])
}
