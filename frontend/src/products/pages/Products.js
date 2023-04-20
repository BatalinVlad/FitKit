import React from 'react';
import { useSelector } from 'react-redux';

import ProductsList from '../../products/components/ProductsList';
import MainNavigation from '../../shared/components/Navigation/MainNavigation';


const Products = ({ socket }) => {
    const productList = useSelector((state) => state.products.value);

    return (
        <React.Fragment>
            <div className='products-page'>
                <MainNavigation />
                <ProductsList socket={socket} products={productList} />
            </div>
        </React.Fragment>
    )
};

export default Products;
