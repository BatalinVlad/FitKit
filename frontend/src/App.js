import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import io from 'socket.io-client';

import Reviews from './reviews/pages/Reviews';
import AddReview from './user/pages/AddReview';
import UserLikedReviews from './user/pages/UserLikedReviews';
import UserReviews from './user/pages/UserReviews';
import UpdateUserReview from './user/pages/UpdateUserReview';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

import './shared/util/cssHelpers.css'

const socket = io.connect('http://localhost:3001');
socket.emit("join_room", 'main_chat');
socket.emit("join_room", 'reviews_room');

const App = () => {
  const { token, login, logout, userId, userName, userImage } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Reviews socket={socket} />
        </Route>
        <Route path="/:userId/reviews" exact>
          <UserReviews socket={socket} />
        </Route>
        <Route path="/addreview" exact>
          <AddReview socket={socket} />
        </Route>
        <Route path="/reviews/:reviewId">
          <UpdateUserReview socket={socket} />
        </Route>
        <Route path="/mylikes/:userId" exact>
          <UserLikedReviews />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Reviews socket={socket} />
        </Route>
        <Route path="/addreview" exact>
          <AddReview socket={socket} />
        </Route>
        <Route path="/:userId/reviews" exact>
          <UserReviews socket={socket} />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userName: userName,
        userImage: userImage,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
