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

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import productsReducer from './features/ProductsSlice';

const DietGenerator = React.lazy(() => import('./chatGPT/DietGenerator'));
const About = React.lazy(() => import('./about/About'));
const LiveChat = React.lazy(() => import('./chat/pages/LiveChat'));
const Products = React.lazy(() => import('./products/pages/Products'));
const AddProduct = React.lazy(() => import('./user/pages/AddProduct'));
const UpdateUserProduct = React.lazy(() => import('./user/pages/UpdateUserProduct'));
// const UserProducts = React.lazy(() => import('./user/pages/UserProducts'));
const Reviews = React.lazy(() => import('./reviews/pages/Reviews'));
const AddReview = React.lazy(() => import('./user/pages/AddReview'));
const UserReviews = React.lazy(() => import('./user/pages/UserReviews'));
const UpdateUserReview = React.lazy(() => import('./user/pages/UpdateUserReview'));
const Auth = React.lazy(() => import('./user/pages/Auth'));


const socket = io.connect(process.env.REACT_APP_ENDPOINT);
socket.emit("join_room", 'reviews_room');

const store = configureStore({
  reducer: {
    products: productsReducer
  }
});

const App = () => {
  const { token, login, logout, userId, userName, userImage, userRole } = useAuth();

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
        <Route path="/addproduct" exact>
          <AddProduct socket={socket} />
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
        <Route path="/products/:productId">
          <UpdateUserProduct socket={socket} />
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
        <Route path="/addproduct" exact>
          <AddProduct socket={socket} />
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
        userRole: userRole,
        login: login,
        logout: logout
      }}
    >
      <Provider store={store}>
        <Router>
          <main>
            <Suspense fallback={
              <LoadingSpinner asOverlay />
            }>
              {routes}
            </Suspense>
          </main>
        </Router>
      </Provider>
    </AuthContext.Provider>
  );
};

export default App;
