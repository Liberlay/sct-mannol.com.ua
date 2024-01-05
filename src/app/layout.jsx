import StoreProvider from './StoreProvider'
import LayoutProvider from './LayoutProvider'
import { ToastContainer } from 'react-toastify'

import '../styles/index.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import 'simplebar-react/dist/simplebar.min.css'

export const metadata = {
  icons: {
    icon: '/assets/images/logos/favicon.ico',
    shortcut: '/assets/images/logos/M-logo.webp',
    apple: '/assets/images/logos/M-logo.webp',
  },
  title: 'Придбати оригінальні автомобільні мастила в Україні | Mannol',
  description:
    'Асортимент продукції MANNOL охоплює широкий асортимент моторних олив, трансмісійних олив, індустріальних олив, гальмівних рідин і охолоджувальних рідин.',
  keywords: [
    'моторне масло',
    'автомобілі',
    'трансмісійне масло',
    'присадки',
    'гальмівні рідини',
    'охолоджуючі рідини',
    'індустріальні масла',
    'автомастила',
    'автомобільні мастила',
    'мастила',
  ],
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sct-mannol.com.ua/'),
  openGraph: {
    url: 'https://sct-mannol.com.ua/',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'SCT-MANNOL.COM.UA',
    images: [
      {
        url: 'static/media/logo.9ab3a9e55e736191c42c.png',
      },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 0,
  themeColor: '#171f32',
}

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <StoreProvider>
          <LayoutProvider>{children}</LayoutProvider>
        </StoreProvider>
        <div id="modals"></div>
        <ToastContainer position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}
