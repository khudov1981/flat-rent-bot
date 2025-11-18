import React from 'react';
import Button from './Button';
import './BottomNavigation.css';

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Сегодня', icon: '🏠' },
    { id: 'accommodations', label: 'Объекты', icon: '🏨' },
    { id: 'calendar', label: 'Календарь', icon: '📅' },
    { id: 'tasks', label: 'Задачи', icon: '📋' },
    { id: 'profile', label: 'Профиль', icon: '👤' }
  ];

  return (
    <nav className="bottom-navigation">
      <ul className="bottom-navigation__list">
        {navItems.map((item) => (
          <li key={item.id} className="bottom-navigation__item">
            <Button
              variant="secondary"
              className={`bottom-navigation__button ${
                activeTab === item.id ? 'bottom-navigation__button--active' : ''
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="bottom-navigation__icon">{item.icon}</span>
              <span className="bottom-navigation__label">{item.label}</span>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavigation;