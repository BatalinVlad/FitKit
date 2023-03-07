import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useHttpClient } from '../../shared/hooks/http-hook';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';

// import UserReviewsList from '../../reviews/components/UserReviewsList';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';

const UserLikedReviews = () => {
    // const { isLoading, error, sendRequest, clearError } = useHttpClient();
    // const [loadedUserLikedReviews, setLoadedUserLikedReviews] = useState();
    const [addLikeToReview, setAddLikeToReview] = useState(true);

    // const userId = useParams().userId;

    // useEffect(() => {
    //     const fetchUserLikedReviews = async () => {
    //         try {
    //             const responseData = await sendRequest(`http://localhost:5000/api/reviews/user/${userId}`);
    //             if (!responseData.userLikedReviews) {
    //                 setAddLikeToReview(true);
    //             }
    //             setLoadedUserLikedReviews(responseData.userLikedReviews);
    //         } catch (err) { };
    //     };
    //     fetchUserLikedReviews();
    // }, [sendRequest, userId])

    if (addLikeToReview) {
        setAddLikeToReview(false);
        return (
            <div >
                <Card>
                    <h2>No reviews found. Maybe create one?</h2>
                    <Button to="/">Back to all reviews</Button>
                </Card>
            </div>
        );
    }

    //   const reviewDeletedhandler = (deletedReviewId) => {
    //     setLoadedUserLikedReviews(prevReviews => prevReviews.filter(review => review.id !== deletedReviewId));
    //   }

    return (
        <React.Fragment>
            <h1> hello! </h1>
            {/* <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                <LoadingSpinner />
                </div>
                )}
                {!isLoading && loadedUserLikedReviews &&
                <UserReviewsList items={loadedUserLikedReviews} />} */}
            {/* onDeleteReview={reviewDeletedhandler}  */}
        </React.Fragment>
    )
};

export default UserLikedReviews;
