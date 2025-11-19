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

  // Определяем иконку в зависимости от типа уведомления
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const notificationClasses = `notification notification--${type}`;

  return (
    <div className={notificationClasses}>
      <div className="notification__content">
        <span className="notification__icon">{getIcon()}</span>
        <span className="notification__message">{message}</span>
      </div>
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
  );
};

export default Notification;