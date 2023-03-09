import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';
import { FiClipboard } from 'react-icons/fi';
import { FiHome } from 'react-icons/fi';
import { FiLogOut } from 'react-icons/fi';
import { FiLogIn } from 'react-icons/fi';


import { FiPlusSquare } from 'react-icons/fi';

const NavLinks = props => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const logoutHandler = () => {
    auth.logout();
    history.push('/');
  }

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          <FiHome />
          <span>
            ALL REVIEWS
          </span>
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/reviews`}>
            <FiClipboard />
            <span>
              MY REVIEWS
            </span>
          </NavLink>
        </li>
      )}
      <li>
        <NavLink to="/addreview">
          <FiPlusSquare />
          <span>
            ADD REVIEW
          </span>
        </NavLink>
      </li>
      {!auth.isLoggedIn && (
        <li className='nav_login'>
          <div className="nav_link_user flex align-center">
            <div className="review-item__user_image  flex align-center">
              <img src='https://res.cloudinary.com/dzeycmkct/image/upload/v1676724957/guestMode_sjwyx7.png' alt='guest' />
            </div>
            <NavLink to="/auth">
              <FiLogIn />
              <span>
                LOG IN
              </span>
            </NavLink>
          </div>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <div className="nav_link_user flex">
            <div className="review-item__user_image  flex align-center">
              <img src={`${auth.userImage}`} alt='user' />
            </div>
            <button onClick={logoutHandler} className="flex align-center">
              <FiLogOut />
            </button>

          </div>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
