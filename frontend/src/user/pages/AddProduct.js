import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';


import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../shared/features/product/ProductSlice';

import { useHttpClient } from '../../shared/hooks/http-hook';

import {
  VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

const NewProduct = () => {
  const dispatch = useDispatch();
  const isLoadingFromDispatch = useSelector((state) => state.products.isLoading);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [user, setUser] = useState();
  const [userDiet, setUserDiet] = useState();


  const history = useHistory();

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
      dietContent: {
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

    const currentDate = new Date();
    const date = currentDate.toDateString();

    dispatch(createProduct({
      productId,
      creatorName: auth.userName,
      creatorId: auth.userId,
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
      description_short: formState.inputs.description_short.value,
      dietContent: formState.inputs.dietContent.value,
      image: formState.inputs.image.value,
      price: formState.inputs.price.value,
      date,
      token: auth.token
    }
    )).then(() => {
      history.push('/products')
    }).catch((error) => {
      console.error('Adding Product failed:', error);
    });
  }

  const addYourDiet = () => {
    setUserDiet(user.dietPlans[0]);

    const initialValue = user.dietPlans[0];
    // id, value, isValid
    inputHandler('dietContent', initialValue, true);
  }

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`);
        setUser(currentUser);
      } catch (err) { };
    };
    getCurrentUser();
  }, [sendRequest, auth.userId, auth.isLoggedIn]);



  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className='add-review-page flex column'>
        <MainNavigation />
        <form className="product-form relative flex column" onSubmit={productSubmitHandler}>
          {isLoading && isLoadingFromDispatch && <LoadingSpinner asOverlay />}
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
          {user && user.dietPlans &&
            <div className='add-your-diet pointer' onClick={addYourDiet}>
              <p>looks like you got diet plans...</p>
            </div>
          }
          {
            userDiet &&
            <Input
              id="dietContent"
              rows='6'
              element="textarea"
              label="your diet plan"
              validators={[VALIDATOR_MINLENGTH(25)]}
              errorText="Please enter a valid description (at least 25 characters)."
              onInput={inputHandler}
              initialValue={userDiet}
            />
          }
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
