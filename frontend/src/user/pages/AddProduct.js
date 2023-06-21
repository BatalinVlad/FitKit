import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

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
  const [dietFound, setDietFound] = useState(false);
  const [userDiets, setUserDiet] = useState();
  const [openDietsModal, setOpenDietsModla] = useState(false);



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

  const tuggleDietModal = () => {
    setOpenDietsModla(prevState => !prevState);
  }

  const setDietPlan = (diet) => {
    setUserDiet(diet);
    const initialValue = diet;
    // id, value, isValid
    inputHandler('dietContent', initialValue, true);
    tuggleDietModal();
  }

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`);
        setUser(currentUser);
        if (currentUser.dietPlans.length > 0) setDietFound(true);
      } catch (err) { };
    };
    getCurrentUser();
  }, [sendRequest, auth.userId, auth.isLoggedIn]);



  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className='add-product-page flex column relative'>
        {openDietsModal && dietFound &&
          <div className='page-wrapper-blur-black'>
            <div className='choose-diet-modal-wrapper center felx column vh100'>
              <div className='choose-diet-modal'>
                <h2>choose one...</h2>
                <div className='choose-diet-container scroll-y'>
                  {user.dietPlans.map((diet, index) => {
                    return <div key={index}>
                      <div className='diet-option-container__wraper'>
                        <span>option {index + 1}</span>
                        <div className='diet-option-container__description pointer' onClick={() => setDietPlan(diet)}>
                          <p>
                            {diet}
                          </p>
                        </div>
                      </div>
                    </div>
                  })
                  }
                </div>
                <div className='choose-diet-modal__back-btn '>
                  <Button action onClick={tuggleDietModal}>
                    <h2 className='pointer'>
                      back
                    </h2>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
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
          <div className='flex space-between'>
            <label>diet plan</label>
            {dietFound &&
              <div className='add-your-diet pointer' onClick={tuggleDietModal}>
                <p>looks like you got diet plans...</p>
              </div>
            }
          </div>
          {
            userDiets &&
            <Input
              id="dietContent"
              element="editor"
              // label="your diet plan"
              validators={[VALIDATOR_MINLENGTH(100)]}
              errorText="Please enter at least 100 characters..."
              onInput={inputHandler}
              initialValue={userDiets}
            />
          }
          {
            !userDiets &&
            <Input
              id="dietContent"
              element="editor"
              // label="your diet plan"
              validators={[VALIDATOR_MINLENGTH(100)]}
              errorText="Please enter at least 100 characters..."
              onInput={inputHandler}
              initialValue={''}
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
