import React from 'react';

// import { useHistory } from 'react-router-dom';

import { getStars } from '../../shared/util/utils';

const ProductItem = props => {
    // const history = useHistory();

    const productHandler = () => {
        // history.push(`/products/${props.productId}`)
    }

    return (
        <React.Fragment>
            <li className="product-item">
                <div className="product-item__link flex column fill-height" onClick={() => productHandler()}>
                    <div className="product-item__content_container">
                        <h2>{props.title}</h2>
                        <div className="flex justify-center">
                            <h2 className="product-item__stars flex">{getStars(props.rate)}</h2>
                        </div>
                        <h3>
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
        </React.Fragment >
    );
};

export default ProductItem;
