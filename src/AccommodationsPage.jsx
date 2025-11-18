import React, { useEffect, useRef } from 'react';
import AccommodationManager from './AccommodationManager';
import './AccommodationsPage.css';

const AccommodationsPage = ({ accommodations, onAccommodationsChange, onAccommodationSelect }) => {
  return (
    <div className="accommodations-page">
      <div className="page-header">
        <h2>Управление объектами размещения</h2>
        <p>Добавляйте, редактируйте и удаляйте объекты размещения</p>
      </div>
      
      <AccommodationManager 
        accommodations={accommodations}
        onAccommodationsChange={onAccommodationsChange}
        onAccommodationSelect={onAccommodationSelect}
      />
    </div>
  );
};

export default AccommodationsPage;