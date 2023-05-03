import React from 'react';
// import { useHistory } from 'react-router-dom';

import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import {
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
// import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
// import { AuthContext } from '../../shared/context/auth-context';

const NewReview = () => {
  // const auth = useContext(AuthContext);
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
    
      rate: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      },
      price: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const reviewSubmitHandler = async event => {
    event.preventDefault();
  }

  const starsInputHandler = (value) => {
    inputHandler('stars', value, true);
  }

  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      <div className='add-review-page flex column'>
        <MainNavigation />
        <form className="review-form flex column" onSubmit={reviewSubmitHandler}>
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
            id="description"
            element="textarea"
            label="describtion"
            rows='2'
            placeholder='describe in couple words...'
            validators={[VALIDATOR_MINLENGTH(15)]}
            errorText="Please enter a valid description (at least 15 characters)."
            onInput={inputHandler}
          />
          <Input
            id="description_short"
            rows='3'
            element="textarea"
            label="tell us more"
            placeholder='tell us more about the product...'
            validators={[VALIDATOR_MINLENGTH(25)]}
            errorText="Please enter a valid description (at least 25 characters)."
            onInput={inputHandler}
          />
          <div className="review-form-stars__container flex column align-start">
            <span>Your rate:</span>
            <div className="review-form-stars">
              <input type="radio" id="five" name="rate" onClick={() => starsInputHandler(5)} />
              <label htmlFor="five"></label>
              <input type="radio" id="four" name="rate" onClick={() => starsInputHandler(4)} />
              <label htmlFor="four"></label>
              <input type="radio" id="three" name="rate" onClick={() => starsInputHandler(3)} />
              <label htmlFor="three"></label>
              <input type="radio" id="two" name="rate" onClick={() => starsInputHandler(2)} />
              <label htmlFor="two"></label>
              <input type="radio" id="one" name="rate" onClick={() => starsInputHandler(1)} />
              <label htmlFor="one"></label>
              <span className="result"></span>
            </div>
          </div>
          <ImageUpload id="image" onInput={inputHandler} errorText="please provide an image" />
          <div className='add-review-btn fill-width flex justify-center'>
            <Button type="submit" size={'big'} action={true} disabled={!formState.isValid}>
              ADD REVIEW
            </Button>
          </div>
        </form >
        <div className='add-review-go-back-btn flex justify-center'>
          <Button type="button" danger={true} >BACK</Button>
        </div>
      </div>
    </React.Fragment >
  );
};

export default NewReview;
