import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import ReviewsList from '../../user/components/ReviewsList';
import MainChat from '../../chat/components/MainChat';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Reviews.css';

const Reviews = ({ socket }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedReviews, setLoadedReviews] = useState();
  const [loadedMainChatMessages, setLoadedMainChatMessages] = useState();
  const [user, setUser] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      setUser('guest');
      return;
    }
    const getCurrentUser = async () => {
      try {
        const currentUser = await sendRequest(`http://localhost:5000/api/users/${auth.userId}`);
        setUser(currentUser);
      } catch (err) { };
    };
    getCurrentUser();
  }, [sendRequest, auth.userId, auth.isLoggedIn]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/reviews');
        setLoadedReviews(responseData.loadedReviews.reverse());
      } catch (err) { };
    };
    fetchReviews();
  }, [sendRequest]);

  useEffect(() => {
    const fetchMainCHatMessages = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/mainchat');
        setLoadedMainChatMessages(responseData.loadedMessages);
      } catch (err) { };
    };
    fetchMainCHatMessages();
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
        <div className='reviews-container'>
          <ReviewsList socket={socket} reviews={loadedReviews} user={user} />
        </div>
      }
      {loadedMainChatMessages &&
        <MainChat socket={socket} messages={loadedMainChatMessages} />}
    </React.Fragment>
  )
};

export default Reviews;
