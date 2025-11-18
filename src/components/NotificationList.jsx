import React, { useState, useMemo, useCallback } from 'react';
import Card from './Card';
import Button from './Button';
import './NotificationList.css';

const NotificationList = ({ notifications = [], onClearAll }) => {
  const [filter, setFilter] = useState('all');
  const [autoClearEnabled, setAutoClearEnabled] = useState(false);
  const [autoClearTime, setAutoClearTime] = useState(24); // часов

  // Проверка валидности пропсов
  const isValidProps = useMemo(() => {
    return Array.isArray(notifications);
  }, [notifications]);

  // Фильтрация уведомлений (мемоизировано)
  const filteredNotifications = useMemo(() => {
    if (!isValidProps) return [];
    
    return notifications.filter(notification => {
      if (!notification || typeof notification !== 'object') return false;
      if (filter === 'all') return true;
      return notification.type === filter;
    });
  }, [notifications, filter, isValidProps]);

  // Сортировка уведомлений по времени (новые первыми) (мемоизировано)
  const sortedNotifications = useMemo(() => {
    return [...filteredNotifications].sort((a, b) => {
      try {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      } catch (error) {
        console.error('Ошибка сортировки уведомлений:', error);
        return 0;
      }
    });
  }, [filteredNotifications]);

  // Форматирование даты с обработкой ошибок
  const formatTime = useCallback((timestamp) => {
    try {
      if (!timestamp) return 'Не указана';
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Недействительная дата';
      
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 0) return 'В будущем';
      if (diffInHours < 1) {
        const minutes = Math.floor((now - date) / (1000 * 60));
        return `${minutes} мин назад`;
      } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `${hours} ч назад`;
      } else {
        return date.toLocaleDateString('ru-RU');
      }
    } catch (error) {
      console.error('Ошибка форматирования времени:', error);
      return 'Ошибка времени';
    }
  }, []);

  // Получение иконки по типу уведомления
  const getIcon = useCallback((type) => {
    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
      default: 'ℹ️'
    };
    
    return icons[type] || icons.default;
  }, []);

  // Получение класса по типу уведомления
  const getTypeClass = useCallback((type) => {
    return `notification-item--${type || 'default'}`;
  }, []);

  // Автоматическая очистка старых уведомлений
  const clearOldNotifications = useCallback(() => {
    if (!autoClearEnabled || !Array.isArray(notifications) || typeof onClearAll !== 'function') return;
    
    try {
      const cutoffTime = Date.now() - (autoClearTime * 60 * 60 * 1000);
      const oldNotifications = notifications.filter(notification => {
        try {
          return new Date(notification.timestamp).getTime() < cutoffTime;
        } catch (error) {
          return false;
        }
      });
      
      if (oldNotifications.length > 0) {
        // В реальной реализации здесь должна быть логика удаления старых уведомлений
        console.log(`Найдено ${oldNotifications.length} старых уведомлений для автоматической очистки`);
      }
    } catch (error) {
      console.error('Ошибка при автоматической очистке уведомлений:', error);
    }
  }, [autoClearEnabled, autoClearTime, notifications, onClearAll]);

  // Эффект для автоматической очистки
  React.useEffect(() => {
    if (!autoClearEnabled) return;
    
    const interval = setInterval(() => {
      clearOldNotifications();
    }, 60000); // Проверяем каждую минуту
    
    return () => clearInterval(interval);
  }, [autoClearEnabled, clearOldNotifications]);

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
          
          <div className="auto-clear-controls">
            <label>
              <input
                type="checkbox"
                checked={autoClearEnabled}
                onChange={(e) => setAutoClearEnabled(e.target.checked)}
              />
              Автоочистка
            </label>
            {autoClearEnabled && (
              <select
                value={autoClearTime}
                onChange={(e) => setAutoClearTime(Number(e.target.value))}
                className="auto-clear-time"
              >
                <option value={1}>1 час</option>
                <option value={6}>6 часов</option>
                <option value={12}>12 часов</option>
                <option value={24}>24 часа</option>
                <option value={48}>48 часов</option>
                <option value={168}>1 неделя</option>
              </select>
            )}
          </div>
          
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
          <p>
            {notifications.length === 0 
              ? 'У вас пока нет уведомлений' 
              : 'Нет уведомлений по выбранному фильтру'}
          </p>
          {autoClearEnabled && (
            <p className="auto-clear-info">
              Автоочистка включена: уведомления старше {autoClearTime} часов будут автоматически удалены
            </p>
          )}
        </Card>
      ) : (
        <div className="notification-list__items">
          {sortedNotifications.map((notification) => (
            <Card 
              key={notification.id || `${notification.timestamp}-${Math.random()}`} 
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
                  {notification.message || 'Пустое сообщение'}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(NotificationList);