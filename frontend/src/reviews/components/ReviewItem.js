import React, { useState, useEffect, useContext, useCallback } from 'react';

import { useHistory } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import { getStars } from '../../shared/util/utils';
import Card from '../../shared/components/UIElements/Card';

import { AiFillEdit } from "react-icons/ai";
import { AiFillLike } from 'react-icons/ai';
import { AiFillDislike } from 'react-icons/ai';

const ReviewItem = props => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const history = useHistory();
  const [access, setAccess] = useState(false);
  const [isLiked, setIsLiked] = useState();
  const [isDisliked, setIsDisliked] = useState();

  const [reviewLikes, setReviewLikes] = useState();
  const [reviewDislikes, setReviewDislikes] = useState();

  const reviewEditHandler = () => {
    if (auth.userId === props.creatorId) {
      history.push(`/reviews/${props.reviewId}`)
    }
    return;
  }

  const reviewHoverEnterHandler = () => {
    if (auth.userId === props.creatorId) {
      setAccess(true);
    }
  };

  const reviewHoverLeaveHandler = () => {
    setAccess(false);
  };

  const reviewLikesHandler = async (event, action) => {
    event.stopPropagation();
    if (!auth.isLoggedIn) return;

    if (action === 'like') {
      setIsLiked(!isLiked)
      setIsDisliked(false);
    } else {
      setIsDisliked(!isDisliked);
      setIsLiked(false);
    }
    // update review ==> send userId and the action LIKE or Dislike
    try {
      const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews/${auth.userId}/${props.reviewId}/${action}`, 'PUT',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      )
      setReviewLikes([...responseData.reviewLikes]);
      setReviewDislikes([...responseData.reviewDislikes]);
    } catch (err) { };
  }

  const setLikeColor = useCallback((user) => {
    const isLikedByUser = !!user.likedReviews.find(likeId => {
      return likeId === props.reviewId;
    });
    const isDislikedByUser = !!user.dislikedReviews.find(dislikeId => {
      return dislikeId === props.reviewId;
    });

    if (isLikedByUser) {
      setIsLiked(true);
      setIsDisliked(false);
      return;
    }
    if (isDislikedByUser) {
      setIsDisliked(true);
      setIsLiked(false);
      return;
    }
    setIsLiked(false);
    setIsDisliked(false);
  }, [props.reviewId]);

  useEffect(() => {
    setReviewLikes(props.reviewLikes);
    setReviewDislikes(props.reviewDislikes);
    if (props.user === 'guest') {
      setIsLiked(false);
      setIsDisliked(false);
      return;
    }
    setLikeColor(props.user);
  }, [auth.isLoggedIn, props.user, props.reviewLikes, props.reviewDislikes, setLikeColor]);

  return (
    <React.Fragment>
      <li className="review-item">
        <Card className="review-item__content flex">
          <div className="review-item__content_link"
            onClick={() => reviewEditHandler()}
            onMouseEnter={() => reviewHoverEnterHandler()}
            onMouseLeave={() => reviewHoverLeaveHandler()}
          >
            <div className="review-item__content_container">
              {access && <div className="review-item__content_edit_button"> <AiFillEdit /> </div>}
              <div className="flex justify-center">
                <div className="flex justify-start">
                  <div className="review-item__user_image flex align-center">
                    <img src={`${props.userImage}`} alt={props.title} />
                  </div>
                  <h2 className="review-item__name flex align-center">{props.name}</h2>
                </div>
                <h2 className="review-item__stars flex">{getStars(props.stars)}</h2>
              </div>
              <hr className="review-item__hr" />
              <h3>
                {props.description}
              </h3>
              <hr className="review-item__hr" />
            </div>
            <div className="review-item__review_image flex relative">
              <img src={`${props.image.secure_url}`} alt={props.title} />
              <div className="review-item__likes_container fill-width">
                <div className="review-item__dislike_buttom half-fill-width flex justify-center align-end"
                  onClick={(event) => reviewLikesHandler(event, 'dislike')}>
                  {isDisliked ?
                    <AiFillDislike style={{ color: "#F32013" }} /> :
                    <AiFillDislike />
                  }
                  <p>{reviewDislikes && reviewDislikes.length}</p>
                </div>
                <div className="review-item__like_buttom half-fill-width flex justify-center align-baseline"
                  onClick={(event) => reviewLikesHandler(event, 'like')}>
                  <p>{reviewLikes && reviewLikes.length}</p>
                  {isLiked ?
                    <AiFillLike style={{ color: "#33b249" }} /> :
                    <AiFillLike />}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ReviewItem;
