import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';


import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../shared/features/product/ProductSlice';

import {
  VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

const NewProduct = () => {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const isLoading = useSelector((state) => state.products.isLoading);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      description_short: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      },
      price: {
        value: 0,
        isValid: false
      }
    },
    false
  );

  const productSubmitHandler = async event => {
    event.preventDefault();
    const productId = uuidv4();
    dispatch(createProduct({
      productId,
      creatorName: auth.userName,
      creatorId: auth.userId,
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
      description_short: formState.inputs.description_short.value,
      image: formState.inputs.image.value,
      price: formState.inputs.price.value,
    }
    ));
    if (!isLoading) {
      history.push('/products')
    }
  }

  return (
    <React.Fragment>
      <div className='add-review-page flex column'>
        <MainNavigation />
        <form className="review-form flex column" onSubmit={productSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="title"
            element="input"
            label="title"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            placeholder='add a title...'
            onInput={inputHandler}
          />
          <Input
            id="description_short"
            element="textarea"
            label="description"
            rows='2'
            placeholder='describe in couple words...'
            validators={[VALIDATOR_MINLENGTH(15)]}
            errorText="Please enter a valid description (at least 15 characters)."
            onInput={inputHandler}
          />
          <Input
            id="description"
            rows='3'
            element="textarea"
            label="tell us more"
            placeholder='tell us more about the product...'
            validators={[VALIDATOR_MINLENGTH(25)]}
            errorText="Please enter a valid description (at least 25 characters)."
            onInput={inputHandler}
          />
          <Input
            id="price"
            element="input"
            type="number"
            label="price"
            placeholder='price...'
            validators={[VALIDATOR_REQUIRE]}
            errorText="Please enter a valid number"
            onInput={inputHandler}
          />
          <div className='mt10'>
            <ImageUpload id="image" onInput={inputHandler} errorText="please provide an image" />
          </div>
          <div className='add-review-btn fill-width flex justify-center'>
            <Button type="submit" size={'big'} action className="uppercase" disabled={!formState.isValid}>
              add product
            </Button>
          </div>
        </form >
      </div>
    </React.Fragment >
  );
};

export default NewProduct;
