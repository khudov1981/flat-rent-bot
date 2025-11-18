import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import TextArea from './TextArea';
import './SettingsPage.css';

const SettingsPage = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailNotifications: false,
    language: 'ru',
    timezone: 'UTC+3',
    currency: 'RUB'
  });

  const [isEditing, setIsEditing] = useState(false);

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

  const themes = [
    { value: 'light', label: 'Светлая' },
    { value: 'dark', label: 'Темная' }
  ];

  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' }
  ];

  const timezones = [
    { value: 'UTC+2', label: 'UTC+2' },
    { value: 'UTC+3', label: 'UTC+3' },
    { value: 'UTC+4', label: 'UTC+4' }
  ];

  const currencies = [
    { value: 'RUB', label: 'Рубль (₽)' },
    { value: 'USD', label: 'Доллар ($)' },
    { value: 'EUR', label: 'Евро (€)' }
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2>Настройки приложения</h2>
      </div>
      
      <Card className="settings-card">
        <div className="settings-section">
          <h3>Основные настройки</h3>
          
          <div className="settings-group">
            <div className="setting-item">
              <label>Тема:</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingsChange('theme', e.target.value)}
                className="setting-select"
                disabled={!isEditing}
              >
                {themes.map(theme => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="setting-item">
              <label>Язык:</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingsChange('language', e.target.value)}
                className="setting-select"
                disabled={!isEditing}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="setting-item">
              <label>Часовой пояс:</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                className="setting-select"
                disabled={!isEditing}
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="setting-item">
              <label>Валюта:</label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingsChange('currency', e.target.value)}
                className="setting-select"
                disabled={!isEditing}
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Уведомления</h3>
          
          <div className="settings-group">
            <div className="setting-item">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingsChange('notifications', e.target.checked)}
                  disabled={!isEditing}
                />
                <span>Уведомления в приложении</span>
              </label>
            </div>
            
            <div className="setting-item">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                  disabled={!isEditing}
                />
                <span>Email уведомления</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Редактировать настройки
            </Button>
          ) : (
            <div className="settings-edit-actions">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Сохранить
              </Button>
            </div>
          )}
        </div>
      </Card>
      
      <Card className="settings-card">
        <div className="settings-section">
          <h3>Данные приложения</h3>
          
          <div className="settings-group">
            <div className="setting-item">
              <label>Версия приложения:</label>
              <span>1.0.0</span>
            </div>
            
            <div className="setting-item">
              <label>Последнее обновление:</label>
              <span>15 мая 2023</span>
            </div>
            
            <div className="setting-item">
              <label>Размер данных:</label>
              <span>2.4 МБ</span>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Очистка данных</h3>
          
          <div className="settings-group">
            <p className="settings-description">
              Очистка данных удалит всю информацию о бронированиях и объектах размещения. 
              Это действие нельзя отменить.
            </p>
            
            <Button variant="danger" size="small">
              Очистить все данные
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;