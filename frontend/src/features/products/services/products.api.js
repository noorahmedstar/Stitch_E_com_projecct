import axios from 'axios'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')

const productApiInstance = axios.create({
  baseURL: `${apiBaseUrl}/product`,
  withCredentials: true,
})

/**
 * Create a new product.
 * @param {FormData} formdata - multipart/form-data with name, category, description, price, stock, images[]
 */
export async function createProduct(formdata) {
  const response = await productApiInstance.post('/', formdata, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

/**
 * Fetch all products for the authenticated seller.
 */
export async function getSellerProduct() {
  const response = await productApiInstance.get('/seller')
  return response.data
}

/**
 * Delete a product by ID.
 * @param {string} id - product._id
 */
export async function deleteProduct(id) {
  const response = await productApiInstance.delete(`/${id}`)
  return response.data
}
