import React from 'react';
import './BottomNavigation.css';

const BottomNavigation = ({ activeTab, onTabChange, onHome }) => {
  return (
    <nav className="bottom-navigation">
      <ul className="bottom-nav-list">
        <li className={`bottom-nav-item ${activeTab === 'accommodations' ? 'active' : ''}`}>
          <button 
            className="bottom-nav-button"
            onClick={() => onTabChange('accommodations')}
          >
            <span className="nav-icon">🏨</span>
            <span className="nav-label">Объекты</span>
          </button>
        </li>
        <li className="bottom-nav-item add-button-item">
          <button 
            className="add-accommodation-button"
            onClick={onHome}
            title="Домой"
          >
            <span className="add-icon">🏠</span>
          </button>
        </li>
        <li className={`bottom-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}>
          <button 
            className="bottom-nav-button"
            onClick={() => onTabChange('calendar')}
            disabled={!activeTab}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-label">Календарь</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavigation;