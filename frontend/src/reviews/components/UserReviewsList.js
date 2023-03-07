import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import UserReviewItem from './UserReviewItem';
import Button from '../../shared/components/FormElements/Button';
import './UserReviewsList.css';

const UserReviewsList = props => {
  if (props.items.length === 0) {
    return (
      <div className="user-reviews-list center">
        <Card>
          <div className='no-reviews-found'> 
            <h2>No reviews found. Maybe create one?</h2>
            <Button action={true} to="/addreview">Create Review</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ul className="reviews-list">
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
          onDelete={props.onDeleteReview}
        />
      ))}
    </ul>
  );
};

export default UserReviewsList;
