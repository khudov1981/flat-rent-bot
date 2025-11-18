import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import './BookingList.css';

const BookingList = ({ accommodations, onAccommodationSelect }) => {
  const [dateFilter, setDateFilter] = useState('');
  
  // Собираем все бронирования
  const getAllBookings = () => {
    const allBookings = [];
    
    accommodations.forEach(accommodation => {
      if (accommodation.bookings && accommodation.bookings.length > 0) {
        accommodation.bookings.forEach(booking => {
          allBookings.push({
            ...booking,
            accommodationName: accommodation.name,
            accommodationId: accommodation.id,
            pricePerNight: accommodation.price
          });
        });
      }
    });
    
    // Сортируем по дате создания (новые первыми)
    allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return allBookings;
  };
  
  const allBookings = getAllBookings();
  
  // Фильтруем бронирования по дате, если задан фильтр
  const filteredBookings = dateFilter 
    ? allBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        const filterDate = new Date(dateFilter);
        return bookingDate.toDateString() === filterDate.toDateString();
      })
    : allBookings;
  
  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  // Форматирование периода бронирования
  const formatBookingPeriod = (dates) => {
    if (!dates || dates.length === 0) return 'Не указан';
    
    const sortedDates = [...dates].sort((a, b) => new Date(a) - new Date(b));
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);
    
    return `${startDate.toLocaleDateString('ru-RU')} - ${endDate.toLocaleDateString('ru-RU')} (${dates.length} ночей)`;
  };
  
  // Расчет общей стоимости
  const calculateTotalPrice = (booking) => {
    return booking.dates ? booking.dates.length * booking.pricePerNight : 0;
  };

  return (
    <div className="booking-list">
      <div className="booking-list__header">
        <h3>Все бронирования</h3>
        <div className="booking-list__filters">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Фильтр по дате"
          />
        </div>
      </div>
      
      {filteredBookings.length === 0 ? (
        <Card className="booking-list__empty">
          <p>{dateFilter ? 'Нет бронирований на выбранную дату' : 'Нет бронирований'}</p>
        </Card>
      ) : (
        <div className="booking-list__items">
          {filteredBookings.map((booking, index) => (
            <Card key={index} className="booking-list__item">
              <div className="booking-list__item-header">
                <h4>{booking.accommodationName}</h4>
                <Button 
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    const accommodation = accommodations.find(acc => acc.id === booking.accommodationId);
                    if (accommodation) {
                      onAccommodationSelect(accommodation);
                    }
                  }}
                >
                  Перейти
                </Button>
              </div>
              
              <div className="booking-list__item-details">
                <p><strong>Клиент:</strong> {booking.client?.fullName || 'Не указан'}</p>
                <p><strong>Телефон:</strong> {booking.client?.phone || 'Не указан'}</p>
                <p><strong>Период:</strong> {formatBookingPeriod(booking.dates)}</p>
                <p><strong>Стоимость:</strong> {calculateTotalPrice(booking)} ₽</p>
                <p><strong>Забронировано:</strong> {formatDate(booking.createdAt)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;