import React, { useReducer, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

  const changeHandler = (event) => {
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

  const handleEditorChange = (value) => {
    dispatch({
      type: 'CHANGE',
      val: value,
      validators: props.validators
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
      const choices = props.choices
      element = (
        <>
          {choices.map((choice) => {
            return <label key={choice} className="flex align-center checkbox__label">
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
    case 'editor':
      element = (
        <div className='editor-container'>
          <ReactQuill
            defaultValue={props.initialValue || ''}
            value={inputState.value}
            onChange={handleEditorChange}
            onBlur={touchHandler}
            placeholder="Enter your diet plan..."
            style={{ height: '85%' }}

          />
        </div>
      )
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
