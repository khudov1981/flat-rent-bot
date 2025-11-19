import React from 'react';
import './TextArea.css';

const TextArea = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  id,
  required = false,
  ...props 
}) => {
  const textAreaClasses = `textarea ${error ? 'textarea--error' : ''} ${className}`;
  const helperTextClasses = `textarea__helper-text ${error ? 'textarea__helper-text--error' : ''}`;
  const labelClasses = `textarea__label ${required ? 'textarea__label--required' : ''}`;
  
  return (
    <div className="textarea-container">
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={textAreaClasses}
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

export default TextArea;