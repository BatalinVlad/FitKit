import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = props => {
  if (props.href) {
    return (
      <a
        className={`button button--${props.size || 'default'} 
        ${props.danger && 'button--danger'} 
        ${props.action && 'button--call_to_action'} 
        ${props.regularAction && 'button--regular_action'}
        ${props.inverse && props.regularAction && 'button--inverse--regular_action'} 
        ${props.edit && 'button--edit'}
        ${props.inverse && props.edit && 'button--inverse--edit'} 
        ${props.upload && 'button--upload'}
        ${props.inverse && props.upload && 'button--inverse--upload'} 
      `}
        href={props.href}
      >
        {props.children}
      </a >
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`button button--${props.size || 'default'} 
        ${props.danger && 'button--danger'} 
        ${props.action && 'button--call_to_action'} 
        ${props.regularAction && 'button--regular_action'} 
        ${props.inverse && props.regularAction && 'button--inverse--regular_action'} 
        ${props.edit && 'button--edit'}
        ${props.inverse && props.edit && 'button--inverse--edit'} 
        ${props.upload && 'button--upload'}
        ${props.inverse && props.upload && 'button--inverse--upload'} 
        `}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`button button--${props.size || 'default'} 
      ${props.danger && 'button--danger'} 
      ${props.action && 'button--call_to_action'}
      ${props.regularAction && 'button--regular_action'} 
      ${props.inverse && props.regularAction && 'button--inverse--regular_action'} 
      ${props.edit && 'button--edit'}
      ${props.inverse && props.edit && 'button--inverse--edit'} 
      ${props.upload && 'button--upload'}
      ${props.inverse && props.upload && 'button--inverse--upload'} 
      `}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
