import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick, 
  type = 'button',
  className = '',
  fullWidth = false,
  ...props 
}) => {
  const buttonClasses = `button button--${variant} button--${size} ${disabled ? 'button--disabled' : ''} ${fullWidth ? 'button--full-width' : ''} ${className}`;
  
  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      <span className="button__content">
        {children}
      </span>
    </button>
  );
};

export default Button;