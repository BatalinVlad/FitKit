import React, { useContext } from 'react';
// import { useHistory } from 'react-router-dom';


import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import { useDispatch } from 'react-redux';
import { addProduct } from '../../features/ProductsSlice';

import {
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
// import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

import { v4 as uuidv4 } from 'uuid';

const NewProduct = () => {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  // const history = useHistory();
  // const { isLoading, sendRequest, error, clearError } = useHttpClient();

  // id: "3",
  // creator: "user4",
  // userImage: "https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg",
  // image: "https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg",
  // title: "advance plan",
  // description_short: "great plan for begginers who just want to lose some pounds",
  // description: "meal plan that get you to lose the first pounds without trying! simple diet plan that works!",
  // favorites: ["user3", "user4", "user2"],
  // rating: 2,
  // price: 199.99

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
        value: 'https://www.allrecipes.com/thmb/k0Yugx575taH6eaSpD51xIC3s-4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-14452-GreenSalad-0025-4x3-527a1d42f2c042c9bcaf1a68223d34e5.jpg',
        isValid: true
      },
      price: {
        value: 59.99,
        isValid: true
      }
    },
    false
  );

  const productSubmitHandler = async event => {
    event.preventDefault();
    dispatch(addProduct({
      productId: uuidv4(),
      creator: auth.userName,
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
      description_short: formState.inputs.description_short.value,
      rate: 0,
      image: formState.inputs.image.value,
      price: formState.inputs.price.value
    }));
  }

  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      <div className='add-review-page flex column'>
        <MainNavigation />
        <form className="review-form flex column" onSubmit={productSubmitHandler}>
          {/* {isLoading && <LoadingSpinner asOverlay />} */}
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
          <ImageUpload id="image" onInput={inputHandler} errorText="please provide an image" />
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
