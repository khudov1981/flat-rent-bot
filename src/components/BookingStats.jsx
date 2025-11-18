import React, { useState, useMemo, useCallback } from 'react';
import StatWidget from './StatWidget';
import Input from './Input';
import './BookingStats.css';

const BookingStats = ({ accommodations = [] }) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Проверка валидности пропсов
  const isValidProps = useMemo(() => {
    return Array.isArray(accommodations);
  }, [accommodations]);

  // Расчет статистики (мемоизировано)
  const stats = useMemo(() => {
    if (!isValidProps) {
      return { totalBookings: 0, totalRevenue: 0, totalNights: 0, totalAccommodations: 0 };
    }

    try {
      let totalBookings = 0;
      let totalRevenue = 0;
      let totalNights = 0;
      
      accommodations.forEach(accommodation => {
        if (accommodation && accommodation.bookings && Array.isArray(accommodation.bookings)) {
          accommodation.bookings.forEach(booking => {
            if (booking && booking.dates && Array.isArray(booking.dates)) {
              // Проверяем, попадает ли бронирование в выбранный период
              if (dateRange.start || dateRange.end) {
                const bookingDate = new Date(booking.createdAt);
                const startDate = dateRange.start ? new Date(dateRange.start) : new Date(0);
                const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
                
                if (bookingDate < startDate || bookingDate > endDate) {
                  return; // Пропускаем бронирование, если оно вне диапазона
                }
              }
              
              const nights = booking.dates.length;
              totalNights += nights;
              totalRevenue += nights * (accommodation.price || 0);
              totalBookings += 1;
            }
          });
        }
      });
      
      return {
        totalBookings,
        totalRevenue,
        totalNights,
        totalAccommodations: accommodations.length
      };
    } catch (error) {
      console.error('Ошибка расчета статистики:', error);
      return { totalBookings: 0, totalRevenue: 0, totalNights: 0, totalAccommodations: 0 };
    }
  }, [accommodations, isValidProps, dateRange]);

  // Форматирование чисел
  const formatNumber = useCallback((num) => {
    try {
      return num.toLocaleString('ru-RU');
    } catch (error) {
      console.error('Ошибка форматирования числа:', error);
      return '0';
    }
  }, []);

  // Форматирование валюты
  const formatCurrency = useCallback((amount) => {
    try {
      return `${formatNumber(amount)} ₽`;
    } catch (error) {
      console.error('Ошибка форматирования валюты:', error);
      return '0 ₽';
    }
  }, [formatNumber]);

  // Сброс фильтров дат
  const resetDateFilters = useCallback(() => {
    setDateRange({ start: '', end: '' });
  }, []);

  return (
    <div className="booking-stats">
      <div className="booking-stats__header">
        <h3>Статистика бронирований</h3>
        <div className="booking-stats__filters">
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            placeholder="Начальная дата"
          />
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            placeholder="Конечная дата"
          />
          <button 
            className="reset-button"
            onClick={resetDateFilters}
          >
            Сбросить
          </button>
        </div>
      </div>
      
      <div className="booking-stats__widgets">
        <StatWidget
          title="Объектов"
          value={stats.totalAccommodations}
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
      
      {dateRange.start || dateRange.end ? (
        <div className="booking-stats__info">
          <p>Статистика за период: {dateRange.start || 'начало'} - {dateRange.end || 'текущая дата'}</p>
        </div>
      ) : (
        <div className="booking-stats__info">
          <p>Общая статистика по всем бронированиям</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(BookingStats);