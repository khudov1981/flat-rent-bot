import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'elevated', 
  className = '', 
  ...props 
}) => {
  const cardClasses = `card card--${variant} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;