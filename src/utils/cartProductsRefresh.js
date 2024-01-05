import { throttle } from 'lodash-es'
import { request } from 'utils/request'
import { limitedRequest } from 'utils/limitedRequest'
import { removeProduct, updateCartItem } from 'store/slices/cartSlice'

export const cartProductsRefresh = throttle(
  (products, dispatch) =>
    Promise.all(
      limitedRequest(products, 20).map((products) =>
        request.unauthorized({
          url: '/products',
          params: {
            vendorCodes: products.map((product) => product.vendorCode).join(),
          },
        }),
      ),
    ).then((response) => {
      const newProducts = Object.fromEntries(
        response
          .map(({ data }) => data)
          .flat()
          .map((product) => [product.vendorCode, product]),
      )

      for (let product of products) {
        if (!newProducts[product.vendorCode]) {
          dispatch(removeProduct(product))
          continue
        }
        const newOption = newProducts[product.vendorCode].options.find(
          (option) => option.key === product.optionKey,
        )
        if (!newOption) {
          dispatch(removeProduct(product))
          continue
        }
        const updatedProduct = {
          vendorCode: product.vendorCode,
          optionKey: product.optionKey,
          details: {
            category: newProducts[product.vendorCode].category,
            title: newProducts[product.vendorCode].title,
            urlKey: newProducts[product.vendorCode].urlKey,
            image: newOption.image,
            label: newOption.label,
            price: newOption.price,
          },
        }
        dispatch(updateCartItem(updatedProduct))
      }
    }),
  120000,
)
