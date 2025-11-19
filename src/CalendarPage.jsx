import React, { useMemo } from 'react';
import Calendar from './Calendar';
import Card from './components/Card';
import StatWidget from './components/StatWidget';
import Breadcrumbs from './components/Breadcrumbs';
import './CalendarPage.css';

const CalendarPage = ({ selectedAccommodation }) => {
  // Проверка валидности пропсов
  const isValidAccommodation = useMemo(() => {
    return selectedAccommodation && typeof selectedAccommodation === 'object';
  }, [selectedAccommodation]);

  // Вычисление статистики по объекту (мемоизировано)
  const accommodationStats = useMemo(() => {
    if (!isValidAccommodation) {
      return {
        totalBookings: 0,
        totalNights: 0,
        totalRevenue: 0,
        averageStay: 0
      };
    }

    try {
      const bookings = selectedAccommodation.bookings || [];
      let totalNights = 0;
      let totalRevenue = 0;

      bookings.forEach(booking => {
        if (booking && Array.isArray(booking.dates)) {
          const nights = booking.dates.length;
          totalNights += nights;
          totalRevenue += nights * (selectedAccommodation.price || 0);
        }
      });

      const averageStay = bookings.length > 0 ? totalNights / bookings.length : 0;

      return {
        totalBookings: bookings.length,
        totalNights,
        totalRevenue,
        averageStay: averageStay.toFixed(1)
      };
    } catch (error) {
      console.error('Ошибка расчета статистики объекта:', error);
      return {
        totalBookings: 0,
        totalNights: 0,
        totalRevenue: 0,
        averageStay: 0
      };
    }
  }, [selectedAccommodation, isValidAccommodation]);

  // Форматирование валюты
  const formatCurrency = useMemo(() => (amount) => {
    try {
      return `${amount.toLocaleString('ru-RU')} ₽`;
    } catch (error) {
      return `${amount} ₽`;
    }
  }, []);

  // Элементы хлебных крошек
  const breadcrumbsItems = [
    { label: 'Главная', onClick: () => console.log('Главная') },
    { label: 'Объекты размещения', onClick: () => console.log('Объекты размещения') },
    { label: selectedAccommodation?.name || 'Календарь бронирования', onClick: null }
  ];

  return (
    <div className="calendar-page">
      <Breadcrumbs items={breadcrumbsItems} />
      
      <div className="page-header">
        <h2>Календарь бронирования</h2>
      </div>
      
      {isValidAccommodation ? (
        <>
          <Card className="selected-accommodation-info">
            <div className="accommodation-header">
              <h3>{selectedAccommodation.name || 'Не указано'}</h3>
              <div className="accommodation-price">
                {selectedAccommodation.price ? `${selectedAccommodation.price} ₽ за ночь` : 'Цена не указана'}
              </div>
            </div>
            
            {selectedAccommodation.description && (
              <p className="accommodation-description">
                {selectedAccommodation.description}
              </p>
            )}
            
            {selectedAccommodation.address && (
              <p className="accommodation-address">
                📍 {selectedAccommodation.address}
              </p>
            )}
            
            {/* Статистика объекта */}
            <div className="accommodation-stats">
              <StatWidget
                title="Бронирований"
                value={accommodationStats.totalBookings}
                icon="📅"
                color="blue"
                size="small"
              />
              <StatWidget
                title="Ночей"
                value={accommodationStats.totalNights}
                icon="🌙"
                color="orange"
                size="small"
              />
              <StatWidget
                title="Доход"
                value={formatCurrency(accommodationStats.totalRevenue)}
                icon="💰"
                color="green"
                size="small"
              />
              <StatWidget
                title="Средняя ночь"
                value={accommodationStats.averageStay}
                icon="📊"
                color="purple"
                size="small"
              />
            </div>
          </Card>
          
          <Calendar 
            selectedAccommodation={selectedAccommodation}
          />
        </>
      ) : (
        <Card className="no-accommodation-message">
          <div className="placeholder-content">
            <span className="placeholder-icon">📅</span>
            <h3>Выберите объект для бронирования</h3>
            <p>Пожалуйста, выберите объект размещения для бронирования</p>
            <p className="hint">Перейдите на вкладку "Объекты размещения" и выберите объект для бронирования</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default React.memo(CalendarPage);