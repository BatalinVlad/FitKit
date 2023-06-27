import React, { useState, useContext } from 'react';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { getStars } from '../../shared/util/utils';


const UserReviewItem = props => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
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
      <li className="user-review-item flex mt10">
        <Card className="user-review-item__content fill-width flex column space-between">
          <div className='user-review-item__content-container'>
            {isLoading && <LoadingSpinner asOverlay />}
            {/* <div className="user-review-item__image">
              <img src={`${props.image.secure_url}`} alt={props.title} className="centerImage" />
            </div> */}
            <div className='flex column space-between'>
              <div className="user-review-item__info">
                <div className="flex space-between">
                  <div className="flex align-center">
                    <div className="user-review-item__user_image flex align-center">
                      <img src={`${props.userImage}`} alt={props.title} />
                    </div>
                    <div className="user-review-item__name">
                      <h2>{props.name}</h2>
                    </div>
                  </div>
                  <h3 className='flex align-center'>{getStars(props.stars)}</h3>
                </div>
                <hr className="review-item__hr" />
                <div className='user-review-item__info-description'>
                  <p>{props.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="user-review-item__actions">
            {auth.userId === props.creatorId && (
              <Button to={`/reviews/${props.id}`} edit >EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default UserReviewItem;
