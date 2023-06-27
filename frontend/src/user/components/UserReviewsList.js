import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import UserReviewItem from './UserReviewItem';
import Button from '../../shared/components/FormElements/Button';
import MainNavigation from '../../shared/components/Navigation/MainNavigation';

const UserReviewsList = props => {
  if (props.items.length === 0) {
    return (
      <div className="user-reviews-list-page flex column">
        <MainNavigation />
        <div className='fill-height center'>
          <Card>
            <div className='no-reviews-found'>
              <h2>No reviews found. Maybe create one?</h2>
              <div className='mt10'>
              <Button action to="/addreview">Create Review</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='user-reviews-list-page'>
      <MainNavigation />
      <ul className="user-reviews-list review-list flex wrap justify-center">
        {props.items.map(review => (
          <UserReviewItem
            key={review.id}
            id={review.id}
            creatorId={review.creator}
            userImage={review.userImage}
            name={review.name}
            stars={review.stars}
            description={review.description}
          />
        ))}
      </ul>
    </div>
  );
};

export default UserReviewsList;
