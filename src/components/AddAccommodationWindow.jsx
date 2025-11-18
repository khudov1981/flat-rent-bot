import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import TextArea from './TextArea';
import Modal from './Modal';
import '../AccommodationManager.css';

const AddAccommodationWindow = () => {
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
      localStorage.setItem('addAccommodationFormData', JSON.stringify(formData));
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // При загрузке окна восстанавливаем данные из localStorage
    const savedData = localStorage.getItem('addAccommodationFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    
    // Устанавливаем заголовок окна
    document.title = 'Добавление объекта размещения';
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Пожалуйста, введите цену за ночь';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Пожалуйста, введите корректную цену';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    // Сохраняем данные в localStorage для передачи в основное окно
    localStorage.setItem('newAccommodation', JSON.stringify({
      ...formData,
      id: Date.now().toString(),
      price: Number(formData.price),
      bookings: []
    }));
    
    // Закрываем окно
    window.close();
  };

  const handleCancel = () => {
    if (window.confirm('Вы уверены, что хотите закрыть форму? Все несохраненные данные будут потеряны.')) {
      localStorage.removeItem('addAccommodationFormData');
      window.close();
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Modal
        isOpen={true}
        onClose={handleCancel}
        title="Добавление нового объекта"
        size="medium"
        actions={[
          <Button key="cancel" variant="secondary" onClick={handleCancel}>
            Отмена
          </Button>,
          <Button key="submit" variant="primary" onClick={handleSubmit}>
            Добавить объект
          </Button>
        ]}
      >
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
        </form>
      </Modal>
    </div>
  );
};

export default AddAccommodationWindow;