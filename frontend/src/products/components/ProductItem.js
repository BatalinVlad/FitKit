import React, { useState, useContext } from 'react';

import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import { AiFillEdit } from "react-icons/ai";

import { getStars } from '../../shared/util/utils';
import Button from '../../shared/components/FormElements/Button';

import { useDispatch } from 'react-redux';
import { deleteProduct } from '../../features/ProductsSlice';

const ProductItem = props => {
    const dispatch = useDispatch();
    const auth = useContext(AuthContext);
    const [access, setAccess] = useState(false);

    const history = useHistory();

    const productHandler = () => {
        if (auth.userId === props.creatorId) {
            history.push(`/products/${props.productId}`);
        }
    }

    const productHoverEnterHandler = () => {
        if (auth.userId === props.creatorId) {
            setAccess(true);
        }
    };

    const productHoverLeaveHandler = () => {
        setAccess(false);
    };

    const deleteProductHandler = (event) => {
        event.stopPropagation();
        dispatch(deleteProduct({ productId: props.productId }))
    }

    return (
        <React.Fragment>
            <div>
                <li className="product-item">
                    <div className="product-item__link flex column fill-height"
                        onClick={() => productHandler()}
                        onMouseEnter={() => productHoverEnterHandler()}
                        onMouseLeave={() => productHoverLeaveHandler()}
                    >
                        {
                            auth.userId === props.creatorId &&
                            <div className="product-item__delete-btn flex">
                                <Button type="button" className="delete uppercase" size="small" danger
                                    onClick={(event) => deleteProductHandler(event)}
                                > delete </Button>
                                <div className="ml10">
                                    <Button type="button" className="delete uppercase" size="small" edit
                                        onClick={(event) => deleteProductHandler(event)}
                                    > update </Button>
                                </div>
                            </div>
                        }
                        <div className="product-item__content_container">
                            {access && <div className="product-item__edit-btn"> <AiFillEdit /> </div>}
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
                        </div>
                        <div className="product-item__image flex grow1">
                            <img src={`${props.image}`} alt={props.title} className="img-cover fill" />
                        </div>
                    </div>
                </li>
                <div className="product-item__footer flex space-between align-baseline ">
                    <p> {props.price} $ </p>
                    <p className="product-item__stars flex">{getStars(props.rate)}</p>
                </div>
            </div>
        </React.Fragment >
    );
};

export default ProductItem;
