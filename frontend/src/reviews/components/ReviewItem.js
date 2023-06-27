import React, { useState, useContext } from 'react';

import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import { getStars } from '../../shared/util/utils';
import { AiFillEdit } from "react-icons/ai";
import Card from '../../shared/components/UIElements/Card';

const ReviewItem = props => {
  const auth = useContext(AuthContext);

  const history = useHistory();
  const [access, setAccess] = useState(false);

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

  return (
    <React.Fragment>
      <li className="review-item">
        <Card className="review-item__content flex">
          <div className="review-item__content_link flex space-between"
            onClick={() => reviewEditHandler()}
            onMouseEnter={() => reviewHoverEnterHandler()}
            onMouseLeave={() => reviewHoverLeaveHandler()}
          >
            <div className="review-item__content_container">
              {access && <div className="review-item__content_edit_button"> <AiFillEdit /> </div>}
              <div className="flex space-between">
                <div className="flex justify-start">
                  <div className="review-item__user_image flex align-center">
                    <img src={`${props.userImage}`} alt={props.title} />
                  </div>
                  <h2 className="review-item__name flex align-center">{props.name}</h2>
                </div>
                <h2 className="review-item__stars flex">{getStars(props.stars)}</h2>
              </div>
              <hr/>
              <h3>
                {props.description}
              </h3>
            </div>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ReviewItem;
