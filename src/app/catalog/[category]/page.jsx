import { omitBy, isEmpty } from 'lodash-es'
import { CATEGORIES } from 'utils/constants'
import { cachedRequest } from 'utils/cachedRequest'
import { Products } from './_components/Products/Products'

export async function generateMetadata({ params }) {
  return {
    title: `${CATEGORIES[params.category].label} | Mannol`,
  }
}

export default async function ProductsListPage({ params, searchParams }) {
  const { data, total } = await cachedRequest(
    `/products?` +
      new URLSearchParams(
        omitBy(
          {
            category: params.category || null,
            type: searchParams.type || null,
            sort: searchParams.sort || null,
            page: searchParams.page || null,
          },
          isEmpty
        )
      ),
    10
  )

  return (
    <Products
      data={data}
      total={total}
      key={searchParams.type + searchParams.sort + searchParams.page}
    />
  )
}
