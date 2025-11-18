import React from 'react';
import './Notification.css';

const Notification = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 5000 
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const notificationClasses = `notification notification--${type}`;

  return (
    <div className={notificationClasses}>
      <div className="notification__content">
        <span className="notification__message">{message}</span>
        {onClose && (
          <button 
            className="notification__close"
            onClick={onClose}
            aria-label="Закрыть уведомление"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;