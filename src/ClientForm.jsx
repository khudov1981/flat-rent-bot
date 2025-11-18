import React, { useState, useCallback, useMemo } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import TextArea from './components/TextArea';
import Card from './components/Card';
import './ClientForm.css';

const ClientForm = ({ 
  selectedAccommodation, 
  selectedDates = [], 
  onBookingComplete, 
  onBack 
}) => {
  const [clientData, setClientData] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Проверка валидности пропсов
  const isValidProps = useMemo(() => {
    return (
      selectedAccommodation && 
      typeof selectedAccommodation === 'object' && 
      Array.isArray(selectedDates)
    );
  }, [selectedAccommodation, selectedDates]);

  // Вычисление общей стоимости (мемоизировано)
  const totalPrice = useMemo(() => {
    if (!isValidProps || selectedDates.length === 0) return 0;
    return (selectedAccommodation.price || 0) * selectedDates.length;
  }, [isValidProps, selectedAccommodation, selectedDates]);

  // Функция для получения отформатированного периода дат (мемоизировано)
  const dateRange = useMemo(() => {
    if (!Array.isArray(selectedDates) || selectedDates.length === 0) return '';
    
    try {
      const validDates = selectedDates.filter(date => date instanceof Date && !isNaN(date));
      if (validDates.length === 0) return '';
      
      const sortedDates = [...validDates].sort((a, b) => a - b);
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
    } catch (error) {
      console.error('Ошибка при форматировании дат:', error);
    }
    
    return '';
  }, [selectedDates]);

  const handleInputChange = useCallback((e) => {
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
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!clientData.fullName || !clientData.fullName.trim()) {
      newErrors.fullName = 'Пожалуйста, введите ФИО клиента';
    } else if (clientData.fullName.trim().split(' ').filter(part => part.length > 0).length < 2) {
      newErrors.fullName = 'Пожалуйста, введите полное ФИО';
    }
    
    if (!clientData.phone || !clientData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, введите номер телефона';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(clientData.phone.trim())) {
      newErrors.phone = 'Пожалуйста, введите корректный номер телефона';
    } else if (clientData.phone.trim().replace(/[\s\-\+\(\)]/g, '').length < 10) {
      newErrors.phone = 'Номер телефона слишком короткий';
    }
    
    if (clientData.email && clientData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientData.email.trim())) {
        newErrors.email = 'Пожалуйста, введите корректный email';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [clientData]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault?.();
    
    if (!validateForm()) {
      return;
    }
    
    if (!isValidProps) {
      console.error('Некорректные данные для бронирования');
      return;
    }
    
    if (typeof onBookingComplete !== 'function') {
      console.error('onBookingComplete не является функцией');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Вызываем функцию завершения бронирования
      await onBookingComplete({
        fullName: clientData.fullName.trim(),
        phone: clientData.phone.trim(),
        email: clientData.email.trim(),
        notes: clientData.notes.trim()
      });
    } catch (error) {
      console.error('Ошибка при бронировании:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [clientData, isValidProps, onBookingComplete, validateForm]);

  const handleBack = useCallback(() => {
    if (typeof onBack === 'function') {
      onBack();
    }
  }, [onBack]);

  // Форматирование количества ночей
  const nightsCount = useMemo(() => {
    return Array.isArray(selectedDates) ? selectedDates.length : 0;
  }, [selectedDates]);

  return (
    <div className="client-form">
      <div className="form-header">
        <h2>Данные клиента</h2>
        <p>Введите информацию о клиенте для бронирования</p>
      </div>
      
      <Card className="booking-summary">
        <h3>Информация о бронировании</h3>
        <div className="summary-item">
          <span>Объект:</span>
          <span>{selectedAccommodation?.name || 'Не выбран'}</span>
        </div>
        <div className="summary-item">
          <span>Период:</span>
          <span>{dateRange || 'Не выбран'}</span>
        </div>
        <div className="summary-item">
          <span>Количество ночей:</span>
          <span>{nightsCount}</span>
        </div>
        <div className="summary-item">
          <span>Стоимость за ночь:</span>
          <span>{selectedAccommodation?.price ? `${selectedAccommodation.price} ₽` : '—'}</span>
        </div>
        <div className="summary-item total">
          <span>Итого:</span>
          <span>{totalPrice} ₽</span>
        </div>
      </Card>
      
      <form onSubmit={handleSubmit} className="client-details-form">
        <Input
          label="ФИО клиента *"
          type="text"
          name="fullName"
          value={clientData.fullName}
          onChange={handleInputChange}
          placeholder="Иванов Иван Иванович"
          error={errors.fullName}
        />
        
        <Input
          label="Номер телефона *"
          type="tel"
          name="phone"
          value={clientData.phone}
          onChange={handleInputChange}
          placeholder="+7 (XXX) XXX-XX-XX"
          error={errors.phone}
        />
        
        <Input
          label="Email"
          type="email"
          name="email"
          value={clientData.email}
          onChange={handleInputChange}
          placeholder="example@email.com"
          error={errors.email}
        />
        
        <TextArea
          label="Комментарии"
          name="notes"
          value={clientData.notes}
          onChange={handleInputChange}
          placeholder="Дополнительная информация о клиенте или пожеланиях..."
          rows="3"
        />
        
        <div className="form-actions">
          <Button 
            variant="secondary"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Назад к выбору дат
          </Button>
          <Button 
            variant="primary"
            type="submit"
            disabled={!isValidProps || nightsCount === 0 || isSubmitting}
          >
            {isSubmitting ? 'Обработка...' : 'Подтвердить бронирование'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(ClientForm);