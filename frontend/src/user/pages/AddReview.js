import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import {
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

const NewReview = ({ socket, onAddReviewModalHandler }) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [generatedText, setGeneratedText] = useState('');
  const [generatedTextIsValid, setGeneratedTextIsValid] = useState(true);

  const [formState, inputHandler] = useForm(
    {
      stars: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
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

  const describenByAi = async () => {
    setGeneratedTextIsValid(true);
    const prompt = `
    hey i am training with Vlad, he is a great coach can you write a short good review on him for me please?
    `

    try {
      const responseData = await sendRequest('https://api.openai.com/v1/completions', 'POST',
        JSON.stringify({ //body
          prompt: prompt,
          max_tokens: 1000,
          model: 'text-davinci-003'
        }),
        { //headers
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
      );
      const generatedText = responseData.choices[0].text;
      setGeneratedText(generatedText);
      // id, value, isValid
      inputHandler('description', generatedText, true);
      setGeneratedTextIsValid(false);
    } catch (err) { };
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className='add-review-page flex column'>
        <MainNavigation />
        <form className="review-form flex column" onSubmit={reviewSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="description"
            element="textarea"
            rows={4}
            label="Your Review"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            generatedText={generatedText}
            generatedTextIsValid={generatedTextIsValid}
          />
          <div>
            <Button type="button" size={'very_small'} regularAction onClick={() => describenByAi()}>
              LET THE AI TAKE CARE OF IT. . .
            </Button>
          </div>
          <div className="review-form-stars__container center flex column">
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
          <div className='add-review-btn fill-width flex justify-center'>
            <Button type="submit" size={'big'} action={true} disabled={!formState.isValid}>
              ADD REVIEW
            </Button>
          </div>
        </form >
        <div className='add-review-go-back-btn flex justify-center'>
          <Button type="button" danger={true} onClick={onAddReviewModalHandler}>BACK</Button>
        </div>
      </div>
    </React.Fragment >
  );
};

export default NewReview;
