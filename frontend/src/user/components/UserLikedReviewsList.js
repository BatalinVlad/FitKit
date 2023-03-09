import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import UserLikedReviewItem from './UserReviewItem';
import Button from '../../shared/components/FormElements/Button';
import './UserReviewsList.css';

const UserLikedReviewsList = props => {
  if (props.items.length === 0) {
    return (
      <div className="reviews-list center">
        <Card>
          <h2>No reviews liked found.</h2>
          <Button to="/">Go back</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="user-reviews-list flex justify-center">
      {props.items.map(review => (
        <UserLikedReviewItem
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
        //   onDelete={props.onDeleteReview}
        />
      ))}
    </ul>
  );
};

export default UserLikedReviewsList;
