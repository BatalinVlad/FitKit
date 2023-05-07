import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import {
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const UpdateUserProduct = props => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedReview, setLoadedReview] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const reviewId = useParams().reviewId;

  const [formState, inputHandler, setFormData] = useForm(
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

  const starsInputHandler = (value) => {
    inputHandler('stars', value, true);
  }

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // useEffect(() => {
  //   const fetchReview = async () => {
  //     try {
  //       const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews/${reviewId}`);
  //       setLoadedReview(responseData.review);

  //       setFormData(
  //         {
  //           stars: {
  //             value: responseData.review.stars,
  //             isValid: true
  //           },
  //           description: {
  //             value: responseData.review.description,
  //             isValid: true
  //           }
  //         },
  //         true
  //       );

  //     } catch (err) { };
  //   };
  //   fetchReview();
  // }, [sendRequest, setFormData, reviewId]);

  const reviewUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews/${reviewId}`, 'PATCH',
        JSON.stringify({
          stars: formState.inputs.stars.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      // history.push(`/${auth.userId}/reviews`);
      history.push(`/`);
    } catch (err) { };
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews/${props.id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + auth.token
      });
      props.onDelete(props.id);
    } catch (err) { }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  // if (!loadedReview && !error) {
  //   return (
  //     <React.Fragment>
  //       <div className="center">
  //         <Card>
  //           <h2>Could not find your product!</h2>
  //         </Card>
  //       </div>
  //     </React.Fragment>
  //   );
  // }


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="user-review-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this review? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      {!isLoading && loadedReview && <div>
        <MainNavigation />
        <form className="review-form" onSubmit={reviewUpdateSubmitHandler}>
          <div className="review-form-stars__container flex column align-start">
            <span>Update your rate:</span>
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
          <Input
            id="description"
            element="textarea"
            label="Your Review"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={loadedReview.description}
            initialValid={true}
          />
          <div className="user-review-update-actions">
            <Button danger onClick={showDeleteWarningHandler}>
              DELETE
            </Button>
            <Button type="submit" action={true} disabled={!formState.isValid}>
              UPDATE
            </Button>
          </div>
        </form>
      </div>
      }
    </React.Fragment >
  );
};

export default UpdateUserProduct;
