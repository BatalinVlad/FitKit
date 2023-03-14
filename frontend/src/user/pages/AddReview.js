import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import {
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ReviewForm.css';

const NewReview = ({ socket }) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      stars: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );

  const reviewSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('stars', formState.inputs.stars.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('userImage', auth.userImage || 'https://res.cloudinary.com/dzeycmkct/image/upload/v1676724957/guestMode_sjwyx7.png');

      if (auth.userId) {
        const user = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`);
        formData.append('name', user.name);
        formData.append('isGuest', false);

        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews`, 'POST', formData, {
          Authorization: 'Bearer ' + auth.token
        });

        //socket emit
        await socket.emit("add_review", responseData.review); 

      } else {
        formData.append('name', 'guest');
        formData.append('isGuest', true);

        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews`, 'POST', formData, {
          Authorization: 'Bearer guestMode'
        });

        //socket emit
        await socket.emit("add_review", responseData.review); 
      }
      socket.off('connection');
      socket.off('receive_review');
      socket.off('disconnect');
      history.push('/reviews');
    } catch (err) { };
  };

  const starsInputHandler = (value) => {
    inputHandler('stars', value, true);
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="review-form flex column" onSubmit={reviewSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="description"
          element="textarea"
          label="Your Review"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
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
        <div className='fill flex justify-center'>
          <Button type="submit" size={'big'} action={true} disabled={!formState.isValid}>
            ADD REVIEW
          </Button>
        </div>
      </form >
    </React.Fragment >
  );
};

export default NewReview;
