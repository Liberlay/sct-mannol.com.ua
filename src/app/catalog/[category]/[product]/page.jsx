import { CATEGORIES } from 'utils/constants'
import { Product } from './_components/Product/Product'
import { cachedRequest } from 'utils/cachedRequest'

const getProduct = async (urlKey) => {
  return await cachedRequest(`/products/${urlKey}`, 60)
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.product)
  return {
    title: `${product.title} | Mannol`,
    description: `${product.description}`,
    keywords: [
      CATEGORIES[params.category].label,
      CATEGORIES[params.category].types[product.type],
      product.vendorCode,
      product.title,
      product.specification,
    ],
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.product)
  return <Product product={product} />
}
