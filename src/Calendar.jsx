import React, { useState, useEffect } from 'react';
import ClientForm from './ClientForm';
import { sendTelegramMessage, formatBookingNotification } from './telegramUtils';
import './Calendar.css';

const Calendar = ({ selectedAccommodation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [bookings, setBookings] = useState({});
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectionMode, setSelectionMode] = useState('none'); // 'none', 'start', 'end'

  // Загрузка бронирований из localStorage при монтировании и при смене объекта
  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error('Ошибка при загрузке бронирований:', e);
      }
    }
  }, []);

  // Сохранение бронирований в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Сброс выбранных дат при смене объекта размещения
  useEffect(() => {
    setSelectedDates([]);
    setShowClientForm(false);
    setSelectionMode('none');
  }, [selectedAccommodation]);

  // Получение забронированных дат для текущего объекта
  const getBookedDates = () => {
    if (!selectedAccommodation) return [];
    
    const accommodationBookings = bookings[selectedAccommodation.id] || [];
    return accommodationBookings.map(booking => new Date(booking));
  };

  // Функция для получения дней в месяце
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Функция для получения первого дня месяца (0-6, где 0 - воскресенье)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Функция для проверки, забронирована ли дата
  const isBooked = (date) => {
    const bookedDates = getBookedDates();
    return bookedDates.some(bookedDate => 
      bookedDate.getDate() === date.getDate() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getFullYear() === date.getFullYear()
    );
  };

  // Функция для проверки, выбрана ли дата
  const isSelected = (date) => {
    return selectedDates.some(selectedDate => 
      selectedDate.getDate() === date.getDate() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getFullYear() === date.getFullYear()
    );
  };

  // Функция для получения количества дней между двумя датами (включительно)
  const getDaysBetweenDates = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  // Функция для выбора даты
  const selectDate = (day) => {
    if (day === 0) return; // Пустая ячейка
    if (!selectedAccommodation) return; // Нет выбранного объекта
    
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    
    // Нельзя выбрать забронированную дату
    if (isBooked(date)) return;
    
    if (selectionMode === 'none') {
      // Первый выбор - начальная дата
      setSelectedDates([date]);
      setSelectionMode('start');
    } else if (selectionMode === 'start') {
      // Второй выбор - конечная дата
      if (date < selectedDates[0]) {
        // Если выбрана дата раньше начальной, меняем местами
        const endDate = selectedDates[0];
        const newSelectedDates = getDaysBetweenDates(date, endDate);
        setSelectedDates(newSelectedDates);
      } else {
        // Выбрана дата позже или равная начальной
        const startDate = selectedDates[0];
        const newSelectedDates = getDaysBetweenDates(startDate, date);
        setSelectedDates(newSelectedDates);
      }
      setSelectionMode('end');
    } else {
      // Новый выбор после завершения диапазона - сброс и начало нового диапазона
      setSelectedDates([date]);
      setSelectionMode('start');
    }
  };

  // Функция для перехода к предыдущему месяцу
  const prevMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    ));
  };

  // Функция для перехода к следующему месяцу
  const nextMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    ));
  };

  // Функция для получения названия месяца
  const getMonthName = (month) => {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return months[month];
  };

  // Функция для получения дней недели
  const getWeekDays = () => {
    return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  };

  // Генерация календаря
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Пустые ячейки в начале месяца
    for (let i = 0; i < firstDay; i++) {
      days.push(0);
    }
    
    // Дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // Разбиваем на недели (по 7 дней)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return weeks;
  };

  // Функция для открытия формы клиента
  const handleOpenClientForm = () => {
    if (!selectedAccommodation || selectedDates.length === 0) return;
    setShowClientForm(true);
  };

  // Функция для возврата к выбору дат
  const handleBackToDates = () => {
    setShowClientForm(false);
  };

  // Функция для завершения бронирования
  const handleBookingComplete = async (clientData) => {
    if (!selectedAccommodation) return;
    
    const newBookings = { ...bookings };
    if (!newBookings[selectedAccommodation.id]) {
      newBookings[selectedAccommodation.id] = [];
    }
    
    // Создаем объект бронирования с данными клиента
    const bookingWithClient = {
      dates: selectedDates.map(date => date.toISOString()),
      client: clientData,
      createdAt: new Date().toISOString()
    };
    
    // Добавляем бронирование к существующим бронированиям
    const existingBookings = newBookings[selectedAccommodation.id] || [];
    newBookings[selectedAccommodation.id] = [...existingBookings, bookingWithClient];
    
    setBookings(newBookings);
    setSelectedDates([]);
    setShowClientForm(false);
    setSelectionMode('none');
    
    // Отправляем уведомление администратору
    const totalPrice = selectedDates.length * selectedAccommodation.price;
    const message = formatBookingNotification(selectedAccommodation, clientData, selectedDates, totalPrice);
    
    // Отправляем сообщение через Telegram Bot API
    await sendTelegramMessage(message);
    
    alert(`Успешно забронировано ${selectedDates.length} дней для ${selectedAccommodation.name}
Клиент: ${clientData.fullName}`);
  };

  const weeks = generateCalendar();
  const weekDays = getWeekDays();

  // Если показываем форму клиента, отображаем её вместо календаря
  if (showClientForm) {
    return (
      <ClientForm
        selectedAccommodation={selectedAccommodation}
        selectedDates={selectedDates}
        onBookingComplete={handleBookingComplete}
        onBack={handleBackToDates}
      />
    );
  }

  // Форматирование даты в формате ДД.ММ.ГГГГ
  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-button">‹</button>
        <h2>{getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}</h2>
        <button onClick={nextMonth} className="nav-button">›</button>
      </div>
      
      <div className="calendar-grid">
        {/* Заголовки дней недели */}
        <div className="weekdays">
          {weekDays.map((day, index) => (
            <div key={index} className="weekday">{day}</div>
          ))}
        </div>
        
        {/* Дни месяца */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="week">
            {week.map((day, dayIndex) => {
              const date = day !== 0 ? new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              ) : null;
              
              const isBookedDate = date && isBooked(date);
              const isSelectedDate = date && isSelected(date);
              
              return (
                <div
                  key={dayIndex}
                  className={`day ${
                    day === 0 ? 'empty' : 
                    isBookedDate ? 'booked' : 
                    isSelectedDate ? 'selected' : ''
                  }`}
                  onClick={() => selectDate(day)}
                >
                  {day !== 0 ? day : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Информация о выбранных датах */}
      {selectedDates.length > 0 && selectedAccommodation && (
        <div className="selected-info">
          <h3>Выбранные даты для {selectedAccommodation.name}:</h3>
          {selectedDates.length > 1 ? (
            <p>
              Период с {formatDate(selectedDates[0])} до {formatDate(selectedDates[selectedDates.length - 1])}
            </p>
          ) : (
            <p>
              Дата: {formatDate(selectedDates[0])}
            </p>
          )}
          <div className="booking-summary">
            <p>Количество ночей: {selectedDates.length}</p>
            <p>Общая стоимость: {selectedDates.length * selectedAccommodation.price} ₽</p>
          </div>
          <button 
            className="book-button"
            onClick={handleOpenClientForm}
          >
            Ввести данные клиента
          </button>
        </div>
      )}
      
      {!selectedAccommodation && (
        <div className="no-accommodation">
          <p>Пожалуйста, выберите объект размещения для бронирования</p>
        </div>
      )}
    </div>
  );
};

export default Calendar;