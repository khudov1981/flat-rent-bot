import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);

  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type,
      duration,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [...prev, newNotification]);
    setNotificationHistory(prev => [...prev, newNotification]);

    // Автоматически удаляем уведомление после истечения времени
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const clearHistory = () => {
    setNotificationHistory([]);
  };

  const value = {
    notifications,
    notificationHistory,
    showNotification,
    removeNotification,
    clearAllNotifications,
    clearHistory
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={0}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};