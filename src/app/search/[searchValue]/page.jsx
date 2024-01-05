import { request } from 'utils/request'
import { Products } from '../../catalog/[category]/_components/Products/Products'

export async function generateMetadata({ params }) {
  return {
    title: `Пошук ${params.searchValue} | Mannol`,
    description: `Пошук товару ${params.searchValue}`,
    keywords: [params.searchValue],
  }
}

export default async function SearchPage({ params }) {
  const { data, total } = await request.unauthorized({
    url: `/products`,
    params: {
      search: params.searchValue ? params.searchValue : null,
    },
  })
  return <Products data={data} total={total} />
}
