import React from 'react';
import Button from './components/Button';
import Card from './components/Card';
import BookingStats from './components/BookingStats';
import './TodayBookings.css';

const TodayBookings = ({ accommodations, onAccommodationSelect }) => {
  // Получаем текущую дату
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  // Фильтруем бронирования на сегодня
  const todayBookings = [];

  accommodations.forEach(accommodation => {
    if (accommodation.bookings && accommodation.bookings.length > 0) {
      accommodation.bookings.forEach(booking => {
        // Проверяем, есть ли сегодняшняя дата в бронировании
        const isTodayBooked = booking.dates.some(dateString => {
          const bookingDate = new Date(dateString);
          return bookingDate.toISOString().split('T')[0] === todayString;
        });

        if (isTodayBooked) {
          todayBookings.push({
            accommodation: accommodation,
            booking: booking
          });
        }
      });
    }
  });

  // Сортируем бронирования по времени начала бронирования
  todayBookings.sort((a, b) => {
    return new Date(a.booking.createdAt) - new Date(b.booking.createdAt);
  });

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

  return (
    <div className="today-bookings">
      <div className="page-header">
        <h2>Бронирования на сегодня</h2>
        <p>{today.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      
      {todayBookings.length === 0 ? (
        <Card className="empty-state">
          <p>На сегодня нет бронирований</p>
        </Card>
      ) : (
        <div className="bookings-list">
          {todayBookings.map((item, index) => (
            <Card key={index} className="booking-card">
              <div className="booking-header">
                <h3>{item.accommodation.name}</h3>
                <Button 
                  variant="secondary"
                  size="small"
                  onClick={() => onAccommodationSelect(item.accommodation)}
                >
                  Перейти к объекту
                </Button>
              </div>
              <div className="booking-details">
                <p className="client-name">Клиент: {item.booking.client.fullName}</p>
                <p className="client-phone">Телефон: {item.booking.client.phone}</p>
                <p className="booking-time">Забронировано: {formatDate(item.booking.createdAt)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <BookingStats accommodations={accommodations} />
    </div>
  );
};

export default TodayBookings;