import NoSsr from 'components/NoSsr/NoSsr'
import { Sidebar } from './_components/Sidebar'

export default function AdminLayout({ children }) {
  return (
    <NoSsr>
      <Sidebar>{children}</Sidebar>
    </NoSsr>
  )
}
