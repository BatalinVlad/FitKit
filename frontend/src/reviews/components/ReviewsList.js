import React, { useState, useEffect, useRef } from 'react';

import ReviewItem from './ReviewItem';
import Card from '../../shared/components/UIElements/Card';

const ReviewsList = props => {
  const [reviewsList, setReviewsList] = useState([]);
  const reviewsRef = useRef(props.reviews);

  useEffect(() => {
    setReviewsList(props.reviews);
  }, [props.reviews]);

  useEffect(() => {
    props.socket.on("receive_review", (data) => {
      const updatedReviews = [data, ...reviewsRef.current];
      setReviewsList(updatedReviews);
    });
    return () => {
      props.socket.off('receive_review');
    };
  }, [props.socket]);

  if (props.reviews.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No reviews found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
        <ul className="reviews-list-container">
          {reviewsList && reviewsList.map((review) => {
            return (
              <ReviewItem
                key={review.id}
                reviewId={review.id}
                userImage={review.userImage}
                name={review.name}
                stars={review.stars}
                description={review.description}
                creatorId={review.creator}
                user={props.user}
              />
            )
          }
          )}
        </ul>
    </React.Fragment>
  );
};

export default ReviewsList;