import { Main } from './Main'
import { request } from 'utils/request'

export const dynamic = 'force-dynamic'

export default async function MainPage() {
  const products = await request.unauthorized({
    url: '/products/presentation',
  })

  return <Main products={products} />
}
