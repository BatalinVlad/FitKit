import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/product/ProductSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
  },
});

export default store;
