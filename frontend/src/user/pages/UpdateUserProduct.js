import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { deleteProduct, updateProduct } from '../../features/ProductsSlice';

import {
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';

import { useForm } from '../../shared/hooks/form-hook';
// import { useHttpClient } from '../../shared/hooks/http-hook';
// import { AuthContext } from '../../shared/context/auth-context';

const UpdateUserProduct = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const auth = useContext(AuthContext);
  // const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const productList = useSelector((state) => state.products.value);
  const [loadedProduct, setLoadedProduct] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const productId = useParams().productId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {
    const loadedProduct = productList.filter((product) => {
      return product.productId === productId
    });
    setLoadedProduct(...loadedProduct);
  }, [setFormData, productList, dispatch, productId]);

  const productUpdateSubmitHandler = async event => {
    event.preventDefault();
    let updatedProduct = { ...loadedProduct, description: formState.inputs.description.value };
    dispatch(updateProduct(updatedProduct));
    history.push(`/products`);

    // try {
    //   await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews/${reviewId}`, 'PATCH',
    //     JSON.stringify({
    //       description: formState.inputs.description.value
    //     }),
    //     {
    //       'Content-Type': 'application/json',
    //       Authorization: 'Bearer ' + auth.token
    //     }
    //   )
    //   // history.push(`/${auth.userId}/reviews`);
    //   history.push(`/`);
    // } catch (err) { };
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    // try {
    //   await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews/${props.id}`, 'DELETE', null, {
    //     Authorization: 'Bearer ' + auth.token
    //   });
    //   props.onDelete(props.id);
    // } catch (err) { }
    dispatch(deleteProduct({ productId }));
    history.push(`/products`);
  };

  if (!loadedProduct) {
    return (
      <React.Fragment>
        <div className='update-product flex column vh100'>
          <MainNavigation />
          <div className="center fill">
            <Card>
              <h2>Could not find your product!</h2>
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  }


  return (
    <React.Fragment>
      <MainNavigation />
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
      <form className="review-form" onSubmit={productUpdateSubmitHandler}>
        <Input
          id="description"
          element="textarea"
          label="Your Review"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
          initialValue={loadedProduct.description}
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
    </React.Fragment >
  );
};

export default UpdateUserProduct;
