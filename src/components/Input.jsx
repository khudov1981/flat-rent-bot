import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  type = 'text',
  id,
  ...props 
}) => {
  const inputClasses = `input ${error ? 'input--error' : ''} ${className}`;
  const helperTextClasses = `input__helper-text ${error ? 'input__helper-text--error' : ''}`;
  
  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className="input__label">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={inputClasses}
        {...props}
      />
      {(error || helperText) && (
        <div className={helperTextClasses}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Input;