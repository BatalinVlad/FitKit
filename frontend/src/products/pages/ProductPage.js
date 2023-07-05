import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import { BsCartCheck } from 'react-icons/bs';
import { TbJewishStar } from 'react-icons/tb';

import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../../shared/features/product/ProductSlice';

const ProductPage = () => {
    const dispatch = useDispatch();
    const productId = useParams().productId;
    const product = useSelector((state) => state.products.selectedProduct);
    const isLoading = useSelector((state) => state.products.isLoading);

    useEffect(() => {
        dispatch(getProductById(productId));
    }, [dispatch, productId]);

    return (
        <React.Fragment>
            {product &&
                <div className='product-page flex column 100vh'>
                    <MainNavigation />
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className='product-container-wrapper flex column center'>
                            <p className='fill-width text-start ml10'> {product.date} </p>
                        <div className='section-one flex'>
                            <div className='actions flex column'>
                                <div className='product__buy-now center'>
                                    <Button type='link' to='/products' regularAction>
                                        <BsCartCheck />
                                    </Button>
                                </div>
                                <div className='product__add-to-fav center'>
                                    <Button type='link' to='/products' regularAction>
                                        <TbJewishStar />
                                    </Button>
                                </div>
                                <div className='product__all-products center'>
                                    <Button type='link' to='/products' regularAction>
                                        ALL
                                    </Button>
                                </div>
                            </div>
                            <div className='product-container flex'>
                                <div className='product-container__content'>
                                    <div>
                                        <h1>
                                            {product.title}
                                        </h1>
                                        <h2>
                                            {product.description}
                                        </h2>
                                        <h2>
                                            {product.description_short}
                                        </h2>
                                        <p className='diet-content mt10'>
                                            {product.dietContent}
                                        </p>
                                    </div>
                                    <p className='bold mt10 fs16'> {product.price} $ </p>

                                </div>
                                <img src={`${product.image.secure_url}`} alt={product.title} className="img-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )
};

export default ProductPage;
