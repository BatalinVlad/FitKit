import { createSlice } from '@reduxjs/toolkit';

const DUMMY_DATA_PRODUCTS = [{
    productId: "1",
    creatorId: "643e6cb803e6b03bdf0b9de1",
    image: "https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg",
    title: "begginers plan",
    description_short: "great plan for begginers who just want to lose some pounds",
    description: "meal plan that get you to lose the first pounds without trying! simple diet plan that works!",
    favorites: ["user3", "user4", "user2"],
    rating: 5,
    price: 99.99
},
{
    productId: "2",
    creatorId: "user2",
    image: "https://cdn.loveandlemons.com/wp-content/uploads/2019/02/meal-prep-ideas.jpg",
    title: "intermidian plan",
    description_short: "great plan for begginers who just want to lose some pounds",
    description: "meal plan that get you to lose the first pounds without trying! simple diet plan that works!",
    favorites: ["user3", "user4", "user2"],
    rating: 4,
    price: 59.99
},
{
    productId: "3",
    creatorId: "643e6cb803e6b03bdf0b9de1",
    image: "https://www.budgetbytes.com/wp-content/uploads/2021/12/Easy-Chicken-and-Vegetable-Meal-Prep-line.jpg",
    title: "advance plan",
    description_short: "great plan for begginers who just want to lose some pounds",
    description: "meal plan that get you to lose the first pounds without trying! simple diet plan that works!",
    favorites: ["user3", "user4", "user2"],
    rating: 2,
    price: 199.99
},
]

export const productSlice = createSlice({
    name: "products",
    initialState: { value: DUMMY_DATA_PRODUCTS },
    reducers: {
        addProduct: (state, action) => {
            state.value.push(action.payload)
        },

        deleteProduct: (state, action) => {
            state.value = state.value.filter((product) =>
                product.productId !== action.payload.productId)
        },
        updateProduct: (state, action) => {
            const updatedProducts = state.value.map((product) => {
                if (product.productId === action.payload.productId) {
                    console.log(action.payload.description)
                    return {
                        ...product,
                        description: action.payload.description
                    };
                }
                return product;
            });

            state.value = updatedProducts;

        }
    }
});

export const { getProductById, addProduct, deleteProduct, updateProduct } = productSlice.actions
export default productSlice.reducer;