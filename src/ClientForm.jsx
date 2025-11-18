import React, { useState } from 'react';
import './ClientForm.css';

const ClientForm = ({ 
  selectedAccommodation, 
  selectedDates, 
  onBookingComplete, 
  onBack 
}) => {
  const [clientData, setClientData] = useState({
    fullName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!clientData.fullName.trim()) {
      newErrors.fullName = 'Пожалуйста, введите ФИО клиента';
    } else if (clientData.fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Пожалуйста, введите полное ФИО';
    }
    
    if (!clientData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, введите номер телефона';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(clientData.phone)) {
      newErrors.phone = 'Пожалуйста, введите корректный номер телефона';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Вызываем функцию завершения бронирования
    onBookingComplete({
      ...clientData,
      fullName: clientData.fullName.trim(),
      phone: clientData.phone.trim()
    });
  };

  const getTotalPrice = () => {
    if (!selectedAccommodation || selectedDates.length === 0) return 0;
    return selectedAccommodation.price * selectedDates.length;
  };

  // Функция для получения отформатированного периода дат
  const getDateRange = () => {
    if (!selectedDates || selectedDates.length === 0) return '';
    
    const sortedDates = [...selectedDates].sort((a, b) => a - b);
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    
    if (startDate && endDate) {
      const startDateStr = startDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long'
      });
      
      const endDateStr = endDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long'
      });
      
      return `${startDateStr} - ${endDateStr}`;
    }
    
    return '';
  };

  return (
    <div className="client-form">
      <div className="form-header">
        <h2>Данные клиента</h2>
        <p>Введите информацию о клиенте для бронирования</p>
      </div>
      
      <div className="booking-summary">
        <h3>Информация о бронировании</h3>
        <div className="summary-item">
          <span>Объект:</span>
          <span>{selectedAccommodation?.name || 'Не выбран'}</span>
        </div>
        <div className="summary-item">
          <span>Период:</span>
          <span>{getDateRange()}</span>
        </div>
        <div className="summary-item">
          <span>Количество ночей:</span>
          <span>{selectedDates.length}</span>
        </div>
        <div className="summary-item">
          <span>Стоимость за ночь:</span>
          <span>{selectedAccommodation?.price ? `${selectedAccommodation.price} ₽` : '—'}</span>
        </div>
        <div className="summary-item total">
          <span>Итого:</span>
          <span>{getTotalPrice()} ₽</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="client-details-form">
        <div className="form-group">
          <label htmlFor="fullName">ФИО клиента *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={clientData.fullName}
            onChange={handleInputChange}
            placeholder="Иванов Иван Иванович"
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Номер телефона *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={clientData.phone}
            onChange={handleInputChange}
            placeholder="+7 (XXX) XXX-XX-XX"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="back-button"
            onClick={onBack}
          >
            Назад к выбору дат
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={!selectedAccommodation || selectedDates.length === 0}
          >
            Подтвердить бронирование
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;