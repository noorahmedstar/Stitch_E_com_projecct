import { createSlice } from '@reduxjs/toolkit'

const ProductSlice = createSlice({
  name: 'product',
  initialState: {
    sellerProduct: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProduct = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setSellerProducts, setLoading, setError } = ProductSlice.actions

export default ProductSlice.reducer
