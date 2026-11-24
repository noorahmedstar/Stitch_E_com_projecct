import { createProduct, getSellerProduct, deleteProduct } from '../services/products.api.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { setSellerProducts, setLoading, setError } from '../state/product.slice.js'

export const useProduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { sellerProduct, loading, error } = useSelector((state) => state.product)

  async function handleCreateProduct(formdata) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await createProduct(formdata)
      // Append newly created product to local store
      dispatch(setSellerProducts([...(sellerProduct ?? []), data.product]))
      return data.product
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create product'
      dispatch(setError(message))
      if (err.response?.status === 401) navigate('/login', { replace: true })
      return null
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleGetSellerProduct() {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await getSellerProduct()
      const products = data.products ?? []
      dispatch(setSellerProducts(products))
      return products
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load products'
      dispatch(setError(message))
      if (err.response?.status === 401) navigate('/login', { replace: true })
      return []
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleDeleteProduct(id) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      await deleteProduct(id)
      dispatch(setSellerProducts((sellerProduct ?? []).filter((p) => p._id !== id)))
      return true
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete product'
      dispatch(setError(message))
      if (err.response?.status === 401) navigate('/login', { replace: true })
      return false
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { handleCreateProduct, handleGetSellerProduct, handleDeleteProduct, sellerProduct, loading, error }
}
