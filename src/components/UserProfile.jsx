import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import './UserProfile.css';

const UserProfile = ({ user, onSettingsChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    language: 'ru'
  });

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSettingsChange(settings);
    setIsEditing(false);
  };

  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' }
  ];

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__header">
          <div className="user-profile__avatar">
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </div>
          <div className="user-profile__info">
            <h3 className="user-profile__name">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="user-profile__username">@{user?.username}</p>
          </div>
        </div>
        
        <div className="user-profile__settings">
          <h4>Настройки</h4>
          
          {isEditing ? (
            <div className="user-profile__settings-form">
              <div className="user-profile__setting">
                <label className="user-profile__setting-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingsChange('notifications', e.target.checked)}
                  />
                  <span>Уведомления в приложении</span>
                </label>
              </div>
              
              <div className="user-profile__setting">
                <label className="user-profile__setting-label">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                  />
                  <span>Email уведомления</span>
                </label>
              </div>
              
              <div className="user-profile__setting">
                <label className="user-profile__setting-label">
                  Язык:
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingsChange('language', e.target.value)}
                    className="user-profile__language-select"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              
              <div className="user-profile__actions">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Сохранить
                </Button>
              </div>
            </div>
          ) : (
            <div className="user-profile__settings-view">
              <div className="user-profile__setting">
                <span>Уведомления в приложении:</span>
                <span>{settings.notifications ? 'Включены' : 'Отключены'}</span>
              </div>
              
              <div className="user-profile__setting">
                <span>Email уведомления:</span>
                <span>{settings.emailNotifications ? 'Включены' : 'Отключены'}</span>
              </div>
              
              <div className="user-profile__setting">
                <span>Язык:</span>
                <span>
                  {languages.find(lang => lang.value === settings.language)?.label || 'Русский'}
                </span>
              </div>
              
              <Button 
                variant="secondary" 
                size="small" 
                onClick={() => setIsEditing(true)}
                className="user-profile__edit-button"
              >
                Редактировать настройки
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;