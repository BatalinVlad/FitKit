import React, { useState, useEffect } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';

import ProductsList from '../../products/components/ProductsList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import MainNavigation from '../../shared/components/Navigation/MainNavigation';

const DUMMY_DATA_PRODUCTS = [{
    id: "1",
    creator: "user1",
    image: "https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg",
    title: "begginers plan",
    description_short: "great plan for begginers who just want to lose some pounds",
    description: "meal plan that get you to lose the first pounds without trying! simple diet plan that works!",
    favorites: ["user3", "user4", "user2"],
    rating: 5
},
{
    id: "2",
    creator: "user2",
    image: "https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg",
    title: "intermidian plan",
    description_short: "great plan for begginers who just want to lose some pounds",
    description: "meal plan that get you to lose the first pounds without trying! simple diet plan that works!",
    favorites: ["user3", "user4", "user2"],
    rating: 4
},
{
    id: "3",
    creator: "user4",
    image: "https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg",
    title: "advance plan",
    description_short: "great plan for begginers who just want to lose some pounds",
    description: "meal plan that get you to lose the first pounds without trying! simple diet plan that works!",
    favorites: ["user3", "user4", "user2"],
    rating: 2
},

]
const Products = ({ socket }) => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedProducts, setLoadedProducts] = useState();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                //change it later 
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/products`);
                setLoadedProducts(DUMMY_DATA_PRODUCTS);
            } catch (err) { };
        };
        fetchProducts();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedProducts &&
                <div className='products-page'>
                    <MainNavigation />
                    <h1 className='text-center'>
                        PRODUCTS PAGE
                    </h1>
                    <ProductsList socket={socket} products={loadedProducts} />
                </div>
            }
        </React.Fragment>
    )
};

export default Products;
