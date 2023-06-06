import React, { useContext, useState, useEffect } from 'react';

import ProductItem from './ProductItem';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';

import { AuthContext } from '../../shared/context/auth-context';


const ProductsList = props => {
    const auth = useContext(AuthContext);
    const [productsList, setProductsList] = useState([]);

    useEffect(() => {
        setProductsList(props.products);
    }, [props.products]);


    if (productsList.length === 0) {
        return (
            <div className="center flex column center grow1">
                <Card>
                    <h2>No products found.</h2>
                </Card>
                {auth.isLoggedIn &&
                    <div className='mt10'>
                        <Button className="uppercase" type="to" href={`/addproduct`} regularAction={true} >add product</Button>
                    </div>
                }
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className='products-list'>
                {auth.isLoggedIn &&
                    <div className='ml10'>
                        <Button className="uppercase" type="to" href={`/addproduct`} regularAction={true} >add product</Button>
                    </div>
                }
                <ul className="products-list-container grid">
                    {productsList.map((product) => {
                        return (
                            <ProductItem
                                key={product.id}
                                productId={product.id}
                                creator={product.creator}
                                image={product.image.secure_url}
                                rate={product.rating}
                                favorites={product.favorites}
                                title={product.title}
                                description_short={product.description_short}
                                description={product.description}
                                dietContent={product.dietContent}
                                price={product.price}
                                date={product.date}
                                deleteProduct={props.deleteProduct}
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