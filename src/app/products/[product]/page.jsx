import { CATEGORIES } from 'utils/constants'
import { cachedRequest } from 'utils/cachedRequest'
import { Product } from './_components/Product/Product'

const getProduct = async (urlKey) => {
  return await cachedRequest(`/products/${urlKey}`, 10)
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.product)
  return {
    title: `${product.title} | Mannol`,
    description: `${product.description}`,
    keywords: [
      CATEGORIES[product.category].label,
      CATEGORIES[product.category].types[product.type],
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
