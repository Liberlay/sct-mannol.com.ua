import { useRef, useEffect, useState } from 'react'

export function useHorizontalScroll() {
  const elRef = useRef()
  const [pos, setPos] = useState(0)
  const isScrollingRef = useRef(false)
  const scrollingAnimationTimeoutRef = useRef(null)
  useEffect(() => {
    const el = elRef.current
    if (el) {
      const onWheel = (e) => {
        if (!e.deltaY) return
        e.preventDefault()
        isScrollingRef.current = true
        setPos((prev) => {
          const n = Math.max(Math.min(prev + e.deltaY, el.scrollWidth - el.clientWidth), 0)
          el.scrollTo({
            left: n,
            behavior: 'smooth',
          })
          return n
        })
        clearTimeout(scrollingAnimationTimeoutRef.current)
        scrollingAnimationTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false
        }, 500)
      }
      const onScroll = () => {
        if (!isScrollingRef.current) setPos(el.scrollLeft)
      }
      el.addEventListener('wheel', onWheel)
      el.addEventListener('scroll', onScroll)
      return () => {
        el.removeEventListener('wheel', onWheel)
        el.addEventListener('scroll', onScroll)
      }
    }
  }, [])
  return elRef
}
