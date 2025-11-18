import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import TextArea from './TextArea';
import './Modal.css';
import '../AccommodationManager.css';

// Генерация уникального ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Безопасная работа с localStorage
const safeLocalStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении в localStorage:', error);
      return false;
    }
  },
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Ошибка при чтении из localStorage:', error);
      return null;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении из localStorage:', error);
      return false;
    }
  }
};

const AddAccommodationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    price: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // При закрытии окна сохраняем данные в localStorage
    const handleBeforeUnload = () => {
      safeLocalStorage.setItem('addAccommodationFormData', formData);
    };
    
    // Проверяем, что window существует (для SSR)
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    
    // При загрузке окна восстанавливаем данные из localStorage
    const savedData = safeLocalStorage.getItem('addAccommodationFormData');
    if (savedData) {
      setFormData(savedData);
    }
    
    // Функция очистки
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
  }, [formData]); // Добавляем formData в зависимости

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, введите название объекта';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Название должно содержать не менее 3 символов';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Пожалуйста, введите цену за ночь';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Пожалуйста, введите корректную цену';
    } else if (Number(formData.price) < 100) {
      newErrors.price = 'Цена должна быть не менее 100 рублей';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Вместо alert используем более подходящий способ
      console.warn('Форма содержит ошибки');
      return;
    }
    
    // Сохраняем данные в localStorage для передачи в основное окно
    const newAccommodation = {
      ...formData,
      id: generateId(),
      price: Number(formData.price),
      bookings: []
    };
    
    if (safeLocalStorage.setItem('newAccommodation', newAccommodation)) {
      // Закрываем окно
      if (typeof window !== 'undefined') {
        window.close();
      }
    } else {
      console.error('Не удалось сохранить данные объекта');
    }
  };

  const handleCancel = () => {
    if (typeof window !== 'undefined' && 
        window.confirm('Вы уверены, что хотите закрыть форму? Все несохраненные данные будут потеряны.')) {
      safeLocalStorage.removeItem('addAccommodationFormData');
      window.close();
    }
  };

  return (
    <div className="modal-backdrop" style={{ position: 'relative', display: 'block', background: 'transparent' }}>
      <div className="modal modal--medium">
        <div className="modal__header">
          <h2 className="modal__title">Добавление нового объекта</h2>
          <button className="modal__close" onClick={handleCancel}>
            ×
          </button>
        </div>
        <div className="modal__content">
          <p>Заполните информацию об объекте размещения</p>
          <form onSubmit={handleSubmit} className="accommodation-form">
            <Input
              label="Название объекта *"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Уютная квартира в центре города"
              error={errors.name}
            />
            
            <TextArea
              label="Описание"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Описание объекта размещения..."
              rows="3"
            />
            
            <Input
              label="Адрес"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Адрес объекта"
            />
            
            <Input
              label="Цена за ночь (₽) *"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="1000"
              error={errors.price}
            />
            
            {/* Отображение ошибок формы */}
            {Object.keys(errors).length > 0 && (
              <div className="form-errors">
                <p>Пожалуйста, исправьте следующие ошибки:</p>
                <ul>
                  {Object.values(errors).map((error, index) => (
                    <li key={index} className="error-text">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
        <div className="modal__footer">
          <Button variant="secondary" onClick={handleCancel}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Добавить объект
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAccommodationForm;