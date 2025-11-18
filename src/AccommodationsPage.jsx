import React from 'react';
import AccommodationManager from './AccommodationManager';
import AccommodationGrid from './components/AccommodationGrid';
import Card from './components/Card';
import './AccommodationsPage.css';

const AccommodationsPage = ({ accommodations, onAccommodationsChange, onAccommodationSelect }) => {
  return (
    <div className="accommodations-page">
      <div className="page-header">
        <h2>Управление объектами размещения</h2>
        <p>Добавляйте, редактируйте и удаляйте объекты размещения</p>
      </div>
      
      <Card className="accommodations-page__content">
        <AccommodationManager 
          accommodations={accommodations}
          onAccommodationsChange={onAccommodationsChange}
          onAccommodationSelect={onAccommodationSelect}
        />
      </Card>
      
      <div className="page-header">
        <h2>Все объекты размещения</h2>
      </div>
      
      <Card className="accommodations-page__content">
        <AccommodationGrid
          accommodations={accommodations}
          onAccommodationSelect={onAccommodationSelect}
          onEditAccommodation={(accommodation) => {
            // Здесь можно открыть форму редактирования
            const event = new CustomEvent('editAccommodation', { detail: accommodation });
            window.dispatchEvent(event);
          }}
          onDeleteAccommodation={(id) => {
            // Здесь можно открыть диалог подтверждения удаления
            const event = new CustomEvent('deleteAccommodation', { detail: id });
            window.dispatchEvent(event);
          }}
        />
      </Card>
    </div>
  );
};

export default AccommodationsPage;