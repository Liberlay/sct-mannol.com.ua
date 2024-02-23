import { Main } from './Main'
import { cachedRequest } from 'utils/cachedRequest'

export const dynamic = 'force-dynamic'

export default async function MainPage() {
  const products = await cachedRequest('/products/presentation', 10)

  return <Main products={products} />
}
