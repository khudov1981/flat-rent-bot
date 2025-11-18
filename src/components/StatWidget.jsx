import React from 'react';
import Card from './Card';
import './StatWidget.css';

const StatWidget = ({ 
  title, 
  value, 
  icon, 
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'stat-widget--blue',
    green: 'stat-widget--green',
    orange: 'stat-widget--orange',
    red: 'stat-widget--red',
    purple: 'stat-widget--purple'
  };

  return (
    <Card className={`stat-widget ${colorClasses[color]} ${className}`}>
      <div className="stat-widget__icon">
        {icon}
      </div>
      <div className="stat-widget__content">
        <div className="stat-widget__value">{value}</div>
        <div className="stat-widget__title">{title}</div>
      </div>
    </Card>
  );
};

export default StatWidget;