import React from 'react';
import './TextArea.css';

const TextArea = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  id,
  ...props 
}) => {
  const textAreaClasses = `textarea ${error ? 'textarea--error' : ''} ${className}`;
  const helperTextClasses = `textarea__helper-text ${error ? 'textarea__helper-text--error' : ''}`;
  
  return (
    <div className="textarea-container">
      {label && (
        <label htmlFor={id} className="textarea__label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={textAreaClasses}
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