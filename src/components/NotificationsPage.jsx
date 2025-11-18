import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import NotificationList from './NotificationList';
import Card from './Card';
import Button from './Button';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const { notificationHistory, clearHistory } = useNotification();

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h2>Уведомления</h2>
      </div>
      
      <Card className="notifications-page__header-card">
        <div className="notifications-page__header-content">
          <div className="notifications-page__header-info">
            <h3>История уведомлений</h3>
            <p>Всего уведомлений: {notificationHistory.length}</p>
          </div>
          {notificationHistory.length > 0 && (
            <Button 
              variant="danger" 
              size="small" 
              onClick={clearHistory}
            >
              Очистить историю
            </Button>
          )}
        </div>
      </Card>
      
      <NotificationList 
        notifications={notificationHistory}
        onClearAll={clearHistory}
      />
    </div>
  );
};

export default NotificationsPage;