import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

export const useUpdateParams = () => {
  const searchParams = useSearchParams()
  const update = useCallback(
    (source) => {
      const params = new URLSearchParams(searchParams)
      for (const p in source) source[p] === null ? params.delete(p) : params.set(p, source[p])
      return `?${params.toString()}`
    },
    [searchParams.toString()],
  )
  return [searchParams, update]
}
