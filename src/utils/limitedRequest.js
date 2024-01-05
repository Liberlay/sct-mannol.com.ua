export const limitedRequest = (products, chunkSize) => {
  const newProducts = []
  for (let i = 0; i < products.length; i += chunkSize) {
    newProducts.push(products.slice(i, i + chunkSize))
  }
  return newProducts
}
