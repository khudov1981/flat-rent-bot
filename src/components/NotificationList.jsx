import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import './NotificationList.css';

const NotificationList = ({ notifications, onClearAll }) => {
  const [filter, setFilter] = useState('all');
  
  // Фильтрация уведомлений
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });
  
  // Сортировка уведомлений по времени (новые первыми)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  // Форматирование даты
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor((now - date) / (1000 * 60));
      return `${minutes} мин назад`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} ч назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };
  
  // Получение иконки по типу уведомления
  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };
  
  // Получение класса по типу уведомления
  const getTypeClass = (type) => {
    return `notification-item--${type}`;
  };

  return (
    <div className="notification-list">
      <div className="notification-list__header">
        <h3>Уведомления</h3>
        <div className="notification-list__controls">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="notification-filter"
          >
            <option value="all">Все уведомления</option>
            <option value="info">Информация</option>
            <option value="success">Успех</option>
            <option value="warning">Предупреждение</option>
            <option value="error">Ошибка</option>
          </select>
          
          {notifications.length > 0 && (
            <Button 
              variant="danger" 
              size="small" 
              onClick={onClearAll}
            >
              Очистить все
            </Button>
          )}
        </div>
      </div>
      
      {sortedNotifications.length === 0 ? (
        <Card className="notification-list__empty">
          <p>{notifications.length === 0 
            ? 'У вас пока нет уведомлений' 
            : 'Нет уведомлений по выбранному фильтру'}</p>
        </Card>
      ) : (
        <div className="notification-list__items">
          {sortedNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`notification-item ${getTypeClass(notification.type)}`}
            >
              <div className="notification-item__header">
                <span className="notification-item__icon">
                  {getIcon(notification.type)}
                </span>
                <span className="notification-item__time">
                  {formatTime(notification.timestamp)}
                </span>
              </div>
              <div className="notification-item__content">
                <p className="notification-item__message">
                  {notification.message}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;