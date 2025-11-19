import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  type = 'text',
  id,
  required = false,
  ...props 
}) => {
  const inputClasses = `input ${error ? 'input--error' : ''} ${className}`;
  const helperTextClasses = `input__helper-text ${error ? 'input__helper-text--error' : ''}`;
  const labelClasses = `input__label ${required ? 'input__label--required' : ''}`;
  
  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={inputClasses}
        required={required}
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