import React from 'react';
import Calendar from './Calendar';
import './CalendarPage.css';

const CalendarPage = ({ selectedAccommodation }) => {
  return (
    <div className="calendar-page">
      <div className="page-header">
        <h2>Календарь бронирования</h2>
        {selectedAccommodation ? (
          <div className="selected-accommodation-info">
            <h3>{selectedAccommodation.name}</h3>
            <p>{selectedAccommodation.price} ₽ за ночь</p>
          </div>
        ) : (
          <div className="no-accommodation-message">
            <p>Пожалуйста, выберите объект размещения для бронирования</p>
            <p className="hint">Перейдите на вкладку "Объекты размещения" и выберите объект для бронирования</p>
          </div>
        )}
      </div>
      
      {selectedAccommodation ? (
        <Calendar 
          selectedAccommodation={selectedAccommodation}
        />
      ) : (
        <div className="calendar-placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">📅</span>
            <p>Календарь будет доступен после выбора объекта размещения</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;