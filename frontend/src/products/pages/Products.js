import React, { useEffect } from 'react';

import ProductsList from '../../products/components/ProductsList';
import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProducts } from '../../shared/features/product/ProductSlice';


const Products = ({ socket }) => {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.products.productsData); // Assuming 'products' is the key in your product slice
    const isLoading = useSelector(state => state.products.isLoading);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const onDeleteProduct = (data) => {
        dispatch(deleteProduct({ productId: data.productId, token: data.userId }))
    }

    return (
        <React.Fragment>
            {isLoading && <LoadingSpinner asOverlay />}
            <div className='products-page flex column vh100'>
                <MainNavigation />
                {productList &&
                    <ProductsList socket={socket} products={productList} deleteProduct={onDeleteProduct} />
                }
            </div>

        </React.Fragment>
    )
};

export default Products;
