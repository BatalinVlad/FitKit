import React, { useContext } from 'react';

import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';

import { getStars } from '../../shared/util/utils';
import Button from '../../shared/components/FormElements/Button';

const ProductItem = props => {
    const auth = useContext(AuthContext);
    const history = useHistory();

    const updateProductHandler = (event) => {
        event.stopPropagation();
        history.push(`/products/${props.productId}`);
    }

    const deleteProductHandler = (event) => {
        event.stopPropagation();
        props.deleteProduct({ productId: props.productId, token: auth.token })
    }

    return (
        <React.Fragment>
            <div className='product-item__wraper'>
                <p className='mr10'>{props.date}</p>
                <li className="product-item">
                    <div className="product-item__link flex column fill-height">
                        {
                            auth.userId === props.creator &&
                            <div className="product-item__actions flex space-between fill-width">
                                <Button type="button" className="delete uppercase" size="very_small" danger
                                    onClick={(event) => deleteProductHandler(event)}
                                > delete </Button>
                                <div className="ml10">
                                    <Button type="button" className="delete uppercase" size="very_small" edit
                                        onClick={(event) => updateProductHandler(event)}
                                    > update </Button>
                                </div>
                            </div>
                        }

                        <div className="product-item__content_container">
                            <div className='flex column'>
                                <h2 className='text-center bold uppercase'>{props.title}</h2>
                            </div>
                            <h3 className='text-center pt10'>
                                {props.description_short}
                            </h3>
                            <hr className="product-item__hr" />
                            <p>
                                {props.description}
                            </p>
                            <hr className="product-item__hr" />

                            <div className='product-item__diet'>
                                <p>
                                    {props.dietContent}
                                </p>
                            </div>
                        </div>
                        <div className="product-item__image flex grow1">
                            <img src={`${props.image}`} alt={props.title} className="img-cover fill" />
                        </div>
                    </div>
                </li>
                <div className="product-item__footer flex space-between align-baseline ">
                    <p className='fs14'> {props.price} $ </p>
                    <p className="product-item__stars flex fs14">{getStars(props.rate)}</p>
                </div>
            </div>
        </React.Fragment >
    );
};

export default ProductItem;
