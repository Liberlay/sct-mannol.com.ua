import { CATEGORIES } from 'utils/constants'
import { cachedRequest } from 'utils/cachedRequest'

export default async function sitemap() {
  let page = 1
  let total = null
  const products = []
  const lastMod = '2024-02-22T02:50:25.145Z'
  do {
    const res = await cachedRequest(`/products?page=${page}`, 10)
    page += 1
    total = res.total
    products.push(...res.data)
  } while (products.length < total)

  return [
    {
      url: 'https://sct-mannol.com.ua',
      lastModified: lastMod,
      priority: 1,
    },
    {
      url: 'https://sct-mannol.com.ua/catalog',
      lastModified: lastMod,
      priority: 1,
    },
    {
      url: 'https://sct-mannol.com.ua/about',
      lastModified: lastMod,
      priority: 0.8,
    },
    {
      url: 'https://sct-mannol.com.ua/contacts',
      lastModified: lastMod,
      priority: 0.8,
    },
    ...Object.keys(CATEGORIES).map((category) => ({
      url: `https://sct-mannol.com.ua/catalog/${category}`,
      lastModified: products
        .filter((p) => p.category === 'car-oil')
        .sort((x, y) => new Date(y.lastModified).getTime() - new Date(x.lastModified).getTime())[0]
        ?.lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    })),
    ...products.map((product) => ({
      url: `https://sct-mannol.com.ua/catalog/${product.category}/${product.urlKey}`,
      lastModified: product.lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
  ]
}
