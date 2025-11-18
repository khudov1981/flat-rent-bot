import React from 'react';
import './Loader.css';

const Loader = ({ 
  size = 'medium', 
  message = '', 
  fullScreen = false,
  overlay = false
}) => {
  const loaderClasses = `loader loader--${size} ${fullScreen ? 'loader--full-screen' : ''} ${overlay ? 'loader--overlay' : ''}`;
  
  return (
    <div className={loaderClasses}>
      <div className="loader__spinner"></div>
      {message && <p className="loader__message">{message}</p>}
    </div>
  );
};

export default Loader;