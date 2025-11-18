import React from 'react';
import Button from './Button';
import Card from './Card';
import './AccommodationGrid.css';

const AccommodationGrid = ({ 
  accommodations, 
  onAccommodationSelect, 
  onEditAccommodation, 
  onDeleteAccommodation 
}) => {
  if (!accommodations || accommodations.length === 0) {
    return (
      <div className="accommodation-grid__empty">
        <p>Нет объектов размещения</p>
      </div>
    );
  }

  return (
    <div className="accommodation-grid">
      {accommodations.map(accommodation => (
        <Card key={accommodation.id} className="accommodation-grid__item">
          <div className="accommodation-grid__header">
            <h3 className="accommodation-grid__title">{accommodation.name}</h3>
          </div>
          
          <div className="accommodation-grid__details">
            {accommodation.description && (
              <p className="accommodation-grid__description">{accommodation.description}</p>
            )}
            
            {accommodation.address && (
              <p className="accommodation-grid__address">📍 {accommodation.address}</p>
            )}
            
            <p className="accommodation-grid__price">💰 {accommodation.price} ₽ за ночь</p>
            
            {accommodation.bookings && accommodation.bookings.length > 0 && (
              <p className="accommodation-grid__bookings">
                Бронирований: {accommodation.bookings.length}
              </p>
            )}
          </div>
          
          <div className="accommodation-grid__actions">
            <Button 
              variant="secondary"
              size="small"
              onClick={() => onAccommodationSelect(accommodation)}
              className="accommodation-grid__action-button"
            >
              Выбрать
            </Button>
            <Button 
              variant="secondary"
              size="small"
              onClick={() => onEditAccommodation(accommodation)}
              className="accommodation-grid__action-button"
            >
              ✏️
            </Button>
            <Button 
              variant="danger"
              size="small"
              onClick={() => onDeleteAccommodation(accommodation.id)}
              className="accommodation-grid__action-button"
            >
              🗑️
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AccommodationGrid;