import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import io from 'socket.io-client';

import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

// const UpdateMyDietDiet = React.lazy(() => import('./chatGPT/UpdateMyDietDiet'));
const DietGenerator = React.lazy(() => import('./chatGPT/DietGenerator'));
const About = React.lazy(() => import('./about/About'));
const LiveChat = React.lazy(() => import('./chat/pages/LiveChat'));
const Products = React.lazy(() => import('./products/pages/Products'));
const Reviews = React.lazy(() => import('./reviews/pages/Reviews'));
const AddReview = React.lazy(() => import('./user/pages/AddReview'));
const UserReviews = React.lazy(() => import('./user/pages/UserReviews'));
const UpdateUserReview = React.lazy(() => import('./user/pages/UpdateUserReview'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

const socket = io.connect(process.env.REACT_APP_ENDPOINT);
socket.emit("join_room", 'reviews_room');

const App = () => {
  const { token, login, logout, userId, userName, userImage } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <About socket={socket} />
        </Route>
        <Route path="/mydietplan" exact>
          <DietGenerator />
        </Route>
        <Route path="/livechat" exact>
          <LiveChat socket={socket} />
        </Route>
        <Route path="/products" exact>
          <Products socket={socket} />
        </Route>
        <Route path="/reviews" exact>
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
          <About socket={socket} />
        </Route>
        <Route path="/mydietplan" exact>
          <DietGenerator />
        </Route>
        <Route path="/livechat" exact>
          <LiveChat socket={socket} />
        </Route>
        <Route path="/products" exact>
          <Products socket={socket} />
        </Route>
        <Route path="/reviews" exact>
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
        <Redirect to="/" />
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
        <main>
          <Suspense fallback={
            <div className='center'>
              <LoadingSpinner />
            </div>
          }>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
