import React, { useContext } from 'react';

import ProductItem from './ProductItem';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';

import { AuthContext } from '../../shared/context/auth-context';

const ProductsList = props => {
    const auth = useContext(AuthContext);

    if (props.products.length === 0) {
        return (
            <div className="center">
                <Card>
                    <h2>No products found.</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className='products-list'>
                {auth.isLoggedIn &&
                    <div>
                        <Button className="uppercase" type="to" href={`/addProduct`} regularAction={true} >add product</Button>
                    </div>
                }
                <ul className="products-list-container grid">
                    {props.products.map((product) => {
                        return (
                            <ProductItem
                                key={product.productId}
                                productId={product.productId}
                                creatorId={product.creatorId}
                                image={product.image}
                                rate={product.rating}
                                favorites={product.favorites}
                                title={product.title}
                                description_short={product.description_short}
                                description={product.description}
                                price={product.price}
                            />
                        )
                    }
                    )}
                </ul>

            </div>
        </React.Fragment>
    );
};

export default ProductsList;