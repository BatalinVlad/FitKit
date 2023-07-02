import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MainNavigation from '../../shared/components/Navigation/MainNavigation';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';

import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../../shared/features/product/ProductSlice';

const ProductPage = () => {
    const dispatch = useDispatch();
    const productId = useParams().productId;
    const product = useSelector((state) => state.products.selectedProduct);
    console.log(product);

    useEffect(() => {
        dispatch(getProductById(productId));
    }, [dispatch, productId]);

    return (
        <React.Fragment>
            {product &&
                <div className='product-page flex column 100vh'>
                    <MainNavigation />
                    {/* {isLoading && <LoadingSpinner asOverlay />} */}
                    <div className='product-container-wrapper flex column center'>
                        <div className='fill-width flex space-between'>
                            <p className='ml10'> {product.price} $ </p>

                            <p className='mr10'>{product.date}</p>
                        </div>
                        <div className='flex row-rev'>
                            <div className='flex column'>
                                <div className='product__buy-now center'>
                                    <Button type='link' to='/products' regularAction>
                                        BUY NOW
                                    </Button>
                                </div>
                                <div className='product__add-to-fav center'>
                                    <Button type='link' to='/products' regularAction>
                                        ADD TO FAV
                                    </Button>
                                </div>
                                <div className='product__all-products center'>
                                    <Button type='link' to='/products' regularAction>
                                        ALL
                                    </Button>
                                </div>
                            </div>
                            <div className='product-container flex column'>
                                <div className='product-container__content'>
                                    <h1>
                                        {product.title}
                                    </h1>
                                    <h2>
                                        {product.description}
                                    </h2>
                                    <h2>
                                        {product.description_short}
                                    </h2>
                                    <p>
                                        {product.dietContent}
                                    </p>
                                </div>
                                {/* <div> */}
                                <img src={`${product.image.secure_url}`} alt={product.title} className="img-cover fill" />
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )
};

export default ProductPage;
