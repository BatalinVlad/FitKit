import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import UserReviewsList from '../../user/components/UserReviewsList';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';

const UserReviews = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUserReviews, setLoadedUserReviews] = useState();
  const [addReview, setAddReview] = useState(false);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews/user/${userId}`);
        if (!responseData.userReviews) {
          setAddReview(true);
        }
        setLoadedUserReviews(responseData.userReviews);
      } catch (err) { };
    };
    fetchUserReviews();
  }, [sendRequest, userId])

  if (addReview) {
    setAddReview(false);
    return (
      <div className="reviews-list-page center">
        <MainNavigation />
        <Card>
          <h2>No reviews found. Maybe create one?</h2>
          <div className='mt10'>
            <Button to="/addreview">Create Review</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUserReviews &&
        <UserReviewsList items={loadedUserReviews} />}
    </React.Fragment>
  )
};

export default UserReviews;
