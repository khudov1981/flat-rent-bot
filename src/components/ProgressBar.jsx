import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ 
  value, 
  maxValue = 100, 
  label = '', 
  showPercentage = true,
  color = 'blue',
  size = 'medium'
}) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  const colorClasses = {
    blue: 'progress-bar--blue',
    green: 'progress-bar--green',
    orange: 'progress-bar--orange',
    red: 'progress-bar--red'
  };
  
  const sizeClasses = {
    small: 'progress-bar--small',
    medium: 'progress-bar--medium',
    large: 'progress-bar--large'
  };

  return (
    <div className={`progress-bar ${colorClasses[color]} ${sizeClasses[size]}`}>
      {label && (
        <div className="progress-bar__label">
          <span>{label}</span>
          {showPercentage && (
            <span>{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className="progress-bar__track">
        <div 
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {!label && showPercentage && (
        <div className="progress-bar__percentage">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;