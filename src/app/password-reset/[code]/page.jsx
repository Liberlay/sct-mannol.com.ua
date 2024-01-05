import { PasswordReset } from './PasswordReset'

export const metadata = {
  title: 'Відновлення паролю | Mannol',
}

export default async function PasswordResetPage({ params }) {
  return <PasswordReset token={params.code} />
}
