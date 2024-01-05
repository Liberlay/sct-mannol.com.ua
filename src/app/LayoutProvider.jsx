'use client'

import { usePathname } from 'next/navigation'
import { Header } from 'components/Header/Header'
import { Footer } from 'components/Footer/Footer'

export default function LayoutProvider({ children }) {
  const pathname = usePathname()

  return (
    <>
      {!pathname.includes('/admin') && <Header />}
      {children}
      {!pathname.includes('/admin') && <Footer />}
    </>
  )
}
