import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import ReviewsList from '../../reviews/components/ReviewsList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import MainNavigation from '../../shared/components/Navigation/MainNavigation';

const Reviews = ({ socket }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedReviews, setLoadedReviews] = useState();
  const [user, setUser] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      setUser('guest');
      return;
    }
    const getCurrentUser = async () => {
      try {
        const currentUser = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`);
        setUser(currentUser);
      } catch (err) { };
    };
    getCurrentUser();
  }, [sendRequest, auth.userId, auth.isLoggedIn]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews`);
        setLoadedReviews(responseData.loadedReviews.reverse());
      } catch (err) { };
    };
    fetchReviews();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedReviews && user &&
        <div className='reviews-page'>
          <MainNavigation />
          <ReviewsList socket={socket} reviews={loadedReviews} user={user} />
        </div>
      }
    </React.Fragment>
  )
};

export default Reviews;
