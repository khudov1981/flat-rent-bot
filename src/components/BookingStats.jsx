import React from 'react';
import StatWidget from './StatWidget';
import './BookingStats.css';

const BookingStats = ({ accommodations }) => {
  // Расчет статистики
  const calculateStats = () => {
    let totalBookings = 0;
    let totalRevenue = 0;
    let totalNights = 0;
    
    accommodations.forEach(accommodation => {
      if (accommodation.bookings) {
        totalBookings += accommodation.bookings.length;
        
        accommodation.bookings.forEach(booking => {
          const nights = booking.dates ? booking.dates.length : 0;
          totalNights += nights;
          totalRevenue += nights * accommodation.price;
        });
      }
    });
    
    return {
      totalBookings,
      totalRevenue,
      totalNights
    };
  };
  
  const stats = calculateStats();
  
  // Форматирование чисел
  const formatNumber = (num) => {
    return num.toLocaleString('ru-RU');
  };
  
  // Форматирование валюты
  const formatCurrency = (amount) => {
    return `${formatNumber(amount)} ₽`;
  };

  return (
    <div className="booking-stats">
      <StatWidget
        title="Объектов"
        value={accommodations.length}
        icon="🏨"
        color="blue"
      />
      
      <StatWidget
        title="Бронирований"
        value={stats.totalBookings}
        icon="📅"
        color="green"
      />
      
      <StatWidget
        title="Ночей"
        value={formatNumber(stats.totalNights)}
        icon="🌙"
        color="orange"
      />
      
      <StatWidget
        title="Доход"
        value={formatCurrency(stats.totalRevenue)}
        icon="💰"
        color="purple"
      />
    </div>
  );
};

export default BookingStats;