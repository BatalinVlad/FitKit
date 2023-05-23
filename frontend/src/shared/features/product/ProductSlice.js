import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts } from '../../api/productApi';

export const getProducts = createAsyncThunk('products/getProducts', async () => {
  try {
    const products = await fetchProducts();
    return products;
  } catch (err) {
    throw new Error('Error fetching products: ' + err.message);
  }
});

const initialState = {
  productsData: [],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      // Handle fulfilled state
      .addCase(getProducts.fulfilled, (state, action) => {
        state.productsData = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      // Handle rejected state
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
