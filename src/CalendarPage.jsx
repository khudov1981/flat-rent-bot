import React from 'react';
import Calendar from './Calendar';
import Card from './components/Card';
import './CalendarPage.css';

const CalendarPage = ({ selectedAccommodation }) => {
  return (
    <div className="calendar-page">
      <div className="page-header">
        <h2>Календарь бронирования</h2>
      </div>
      
      {selectedAccommodation ? (
        <>
          <Card className="selected-accommodation-info">
            <h3>{selectedAccommodation.name}</h3>
            <p>{selectedAccommodation.price} ₽ за ночь</p>
            {selectedAccommodation.description && (
              <p className="accommodation-description">{selectedAccommodation.description}</p>
            )}
          </Card>
          
          <Calendar 
            selectedAccommodation={selectedAccommodation}
          />
        </>
      ) : (
        <Card className="no-accommodation-message">
          <div className="placeholder-content">
            <span className="placeholder-icon">📅</span>
            <p>Пожалуйста, выберите объект размещения для бронирования</p>
            <p className="hint">Перейдите на вкладку "Объекты размещения" и выберите объект для бронирования</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CalendarPage;