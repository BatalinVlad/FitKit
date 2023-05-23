import React, { useEffect } from 'react';

import ProductsList from '../../products/components/ProductsList';
import MainNavigation from '../../shared/components/Navigation/MainNavigation';

import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../shared/features/product/ProductSlice';


const Products = ({ socket }) => {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.products.productsData); // Assuming 'products' is the key in your product slice
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);
    return (
        <React.Fragment>
            <div className='products-page flex column vh100'>
                <MainNavigation />
                {productList &&
                    <ProductsList socket={socket} products={productList} />
                }
            </div>
        </React.Fragment>
    )
};

export default Products;
