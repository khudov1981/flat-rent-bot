import React from 'react';
import Button from './Button';
import './AppNavigation.css';

const AppNavigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Сегодня', icon: '🏠' },
    { id: 'accommodations', label: 'Объекты', icon: '🏨' },
    { id: 'calendar', label: 'Календарь', icon: '📅' },
    { id: 'tasks', label: 'Задачи', icon: '📋' },
    { id: 'profile', label: 'Профиль', icon: '👤' },
    { id: 'notifications', label: 'Уведомления', icon: '🔔' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
    { id: 'help', label: 'Помощь', icon: '❓' }
  ];

  return (
    <nav className="app-navigation">
      <ul className="app-navigation__list">
        {navItems.map((item) => (
          <li key={item.id} className="app-navigation__item">
            <Button
              variant={activeTab === item.id ? 'primary' : 'secondary'}
              className={`app-navigation__button ${
                activeTab === item.id ? 'app-navigation__button--active' : ''
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="app-navigation__icon">{item.icon}</span>
              <span className="app-navigation__label">{item.label}</span>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AppNavigation;