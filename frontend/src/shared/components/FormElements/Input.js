import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      }
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput]);

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  let element;
  switch (props.element) {
    case 'input':
      element = (
        <input
          id={props.id}
          type={props.type}
          placeholder={props.placeholder}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
        />
      );
      break;
    case 'textarea':
      if (props.initialValueIsValid) {
        const initialValue = props.initialValue || '';
        inputState.value = inputState.value + initialValue;
        inputState.isTouched = true;
        inputState.isValid = true;
      }
      element = (
        <textarea
          id={props.id}
          rows={props.rows || 3}
          onChange={changeHandler}
          placeholder={props.placeholder}
          onBlur={touchHandler}
          value={inputState.value}
        />
      );
      break;
    case 'checkbox':
      // YOU MUST MAKE IT MORE DYNAMIC !!
      const choices = props.choices
      element = (
        <>
          {choices.map((choice) => {
            return <label key={choice} className="center checkbox__label">
              <input
                type="checkbox"
                name={choice}
                value={choice}
                checked={inputState.value === choice}
                onChange={changeHandler}
                className="checkbox"
              />
              {choice}
            </label>
          })}
        </>
      );
      break;
    default:
      element = null;
  }

  return (
    <div
      className={`form-control 
      ${props.styles && props.styles}
      ${!inputState.isValid && inputState.isTouched &&
        'form-control--invalid'}`}
    >
      {
        props.label &&
        <label htmlFor={props.id}>{props.label}</label>
      }
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
