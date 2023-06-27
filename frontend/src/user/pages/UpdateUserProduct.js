import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
// import { deleteProduct, updateProduct } from '../../shared/features/ProductsSlice';

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { deleteProduct, updateProduct } from '../../shared/features/product/ProductSlice';

const UpdateUserProduct = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const productList = useSelector((state) => state.products.productsData);
  const isLoading = useSelector((state) => state.products.isLoading);

  const [loadedProduct, setLoadedProduct] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const productId = useParams().productId;


  const [formState, inputHandler, setFormData] = useForm(
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
        isValid: true
      },
      price: {
        value: 0,
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
      return product.id === productId
    });
    setLoadedProduct(...loadedProduct);
  }, [setFormData, productList, dispatch, productId]);

  const productUpdateSubmitHandler = async event => {
    event.preventDefault();
    const currentDate = new Date();
    const date = currentDate.toDateString();

    let updatedImage;
    if (!formState.inputs.image.value) {
      updatedImage = loadedProduct.image;
    } else updatedImage = formState.inputs.image.value;

    dispatch(updateProduct({
      productId: loadedProduct.id,
      creatorId: auth.userId,
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
      description_short: formState.inputs.description_short.value,
      dietContent: formState.inputs.dietContent.value,
      image: updatedImage,
      price: formState.inputs.price.value,
      token: auth.token,
      date
    }
    ))
      .then(() => {
        history.push('/products')
      }).catch((error) => {
        console.error('Updating Product failed:', error);
      });
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    dispatch(deleteProduct({ productId, token: auth.userId }))
      .then(() => {
        history.push('/products')
      })
      .catch((error) => {
        console.error('Deliting Product failed:', error);
      });
  };

  if (!loadedProduct) {
    return (
      <React.Fragment>
        <div className='update-product-page flex column vh100'>
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
      <div className='update-product-page flex column'>
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
            Do you want to proceed and delete this product? Please note that it
            can't be undone thereafter.
          </p>
        </Modal>


        <form className="review-form relative flex column" onSubmit={productUpdateSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="title"
            element="input"
            label="title"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            placeholder='add a title...'
            onInput={inputHandler}
            initialValue={loadedProduct.title}
            initialValid={true}
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
            initialValue={loadedProduct.description_short}
            initialValid={true}
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
            initialValue={loadedProduct.description}
            initialValid={true}
          />

          <Input
            id="dietContent"
            element="editor"
            // label="your diet plan"
            validators={[VALIDATOR_MINLENGTH(100)]}
            errorText="Please enter at least 100 characters..."
            onInput={inputHandler}
            initialValue={loadedProduct.dietContent}
          />
{/* 
          <Input
            id="dietContent"
            rows='8'
            element="textarea"
            label="your diet plan"
            placeholder='tell us more about the diet...'
            validators={[VALIDATOR_MINLENGTH(100)]}
            errorText="Please enter a valid plan (at least 100 characters)."
            onInput={inputHandler}
            initialValue={loadedProduct.dietContent}
            initialValid={true}
          /> */}


          <Input
            id="price"
            element="input"
            type="number"
            label="price"
            placeholder='price...'
            validators={[VALIDATOR_REQUIRE]}
            errorText="Please enter a valid number"
            onInput={inputHandler}
            initialValue={loadedProduct.price}
            initialValid={true}
          />
          <div className='mt10'>
            <ImageUpload id="image"
              onInput={inputHandler}
              previewUrl={loadedProduct.image.secure_url}
              initialValid={true}
              errorText="please provide an image" />
          </div>

          <div className="user-review-update-actions mt10">
            <Button danger onClick={showDeleteWarningHandler}>
              DELETE
            </Button>
            <Button type="submit" action disabled={!formState.isValid}>
              UPDATE
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment >
  );
};

export default UpdateUserProduct;
