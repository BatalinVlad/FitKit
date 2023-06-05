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

export const createProduct = createAsyncThunk('products/createProduct', async (productData) => {
    const formData = new FormData();
    formData.append('productId', productData.productId);
    formData.append('creator', productData.creatorId);
    formData.append('creatorName', productData.creatorName);
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('description_short', productData.description_short);
    formData.append('image', productData.image);
    formData.append('price', productData.price);
    formData.append('date', productData.date);

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + productData.token
            },
            body: formData
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message);
        }
        return responseData.product;
    } catch (err) {
        throw new Error('Error creating product: ' + err.message);
    }
});


export const updateProduct = createAsyncThunk('products/updateProduct', async (productData) => {
    const formData = new FormData();
    formData.append('creator', productData.creatorId);
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('description_short', productData.description_short);
    formData.append('price', productData.price);
    formData.append('date', productData.date);
    formData.append('image', productData.image);
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/products/${productData.productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + productData.token
            },
            body: formData
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message);
        }

        return responseData.product;
    } catch (err) {
        throw new Error('Error updating product: ' + err.message);
    }
});

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (data, { rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/products/${data.productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + data.token
                },

            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            return data.productId;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


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
            //GET ALL PRODUCTS
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.productsData = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            //CREATE PRODUCT
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.productsData.push(action.payload);
                state.isLoading = false;
                state.error = null;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            //UPDATE PRODUCT
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const updatedProduct = action.payload;
                const index = state.productsData.findIndex((product) => product.productId === updatedProduct.productId);

                if (index !== -1) {
                    state.productsData[index] = updatedProduct;
                }

                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            //DELETE PRODUCT
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.productsData = state.productsData.filter(
                    (product) => product.id !== action.payload
                );
                state.isLoading = false;
                state.error = null;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });

    },
});

export default productSlice.reducer;
