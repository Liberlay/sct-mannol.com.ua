import { request } from 'utils/request'
import { Products } from './_components/Products/Products'
import { CATEGORIES } from 'utils/constants'

export async function generateMetadata({ params }) {
  return {
    title: `${CATEGORIES[params.category].label} | Mannol`,
  }
}

export default async function ProductsListPage({ params, searchParams }) {
  const { data, total } = await request.unauthorized({
    url: `/products`,
    params: {
      category: params.category ? params.category : null,
      type: searchParams.type ? searchParams.type : null,
      sort: searchParams.sort ? searchParams.sort : null,
      page: searchParams.page ? searchParams.page : null,
    },
  })

  return (
    <Products
      data={data}
      total={total}
      key={searchParams.type + searchParams.sort + searchParams.page}
    />
  )
}
