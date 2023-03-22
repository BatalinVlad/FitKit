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
              <Button action={true} to="/addreview">Create Review</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='user-reviews-list-page'>
      <MainNavigation />
      <ul className="user-reviews-list review-list flex justify-center">
        {props.items.map(review => (
          <UserReviewItem
            key={review.id}
            id={review.id}
            creatorId={review.creator}
            image={review.image}
            userImage={review.userImage}
            name={review.name}
            stars={review.stars}
            description={review.description}
            likes={review.likes.length}
            dislikes={review.dislikes.length}
          />
        ))}
      </ul>
    </div>
  );
};

export default UserReviewsList;
