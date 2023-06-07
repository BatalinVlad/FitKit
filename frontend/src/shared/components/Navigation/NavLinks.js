import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import { FiHome } from 'react-icons/fi';
import { FiLogOut } from 'react-icons/fi';
import { FiLogIn } from 'react-icons/fi';
import { AiOutlineStar } from 'react-icons/ai';

import { RiWechatPayLine } from 'react-icons/ri';
import { HiOutlineNewspaper } from 'react-icons/hi';
import {MdOutlineLocalGroceryStore} from 'react-icons/md'
const NavLinks = () => {
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
            HOME
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/products" exact>
          <MdOutlineLocalGroceryStore />
          <span>
            PRODUCTS
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/reviews" exact>
          <AiOutlineStar />
          <span>
            REVIEWS
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/mydietplan">
          <HiOutlineNewspaper />
          <span>
            DIET PLAN
          </span>
        </NavLink>
      </li>
      <li className="livechat-nav">
        <NavLink to="/livechat" exact>
          <RiWechatPayLine />
          <span>
            LIVE CHAT
          </span>
        </NavLink>
      </li>

      {!auth.isLoggedIn && (
        <li className='nav_login'>
          <NavLink to="/auth">
            <FiLogIn />
            <span>
              LOG IN
            </span>
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li className='logout-nav flex align-center justify-center'>
          <div className="review-item__user_image  flex align-center">
            <img src={`${auth.userImage}`} alt='user' />
          </div>
          <button onClick={logoutHandler} className="logout-btn flex align-center">
            <FiLogOut />
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
