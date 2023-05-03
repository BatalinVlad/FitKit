import { createSlice } from '@reduxjs/toolkit';

const DUMMY_DATA_PRODUCTS = [{
    id: "1",
    creator: "user1",
    image: "https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg",
    title: "begginers plan",
    description_short: "great plan for begginers who just want to lose some pounds",
    description: "meal plan that get you to lose the first pounds without trying! simple diet plan that works!",
    favorites: ["user3", "user4", "user2"],
    rating: 5,
    price: 99.99
},
{
    id: "2",
    creator: "user2",
    image: "https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg",
    title: "intermidian plan",
    description_short: "great plan for begginers who just want to lose some pounds",
    description: "meal plan that get you to lose the first pounds without trying! simple diet plan that works!",
    favorites: ["user3", "user4", "user2"],
    rating: 4,
    price: 59.99
},
{
    id: "3",
    creator: "user4",
    image: "https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg",
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

        }
    }
});

export default productSlice.reducer;