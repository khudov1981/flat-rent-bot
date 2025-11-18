import React, { useState, useContext, useEffect } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import TextArea from './components/TextArea';
import Card from './components/Card';
import Modal from './components/Modal';
import ConfirmationDialog from './components/ConfirmationDialog';
import { useNotification } from './contexts/NotificationContext';
import './AccommodationManager.css';

const AccommodationManager = ({ accommodations, onAccommodationsChange, onAccommodationSelect }) => {
  const { showNotification } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    price: ''
  });
  const [errors, setErrors] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState(null);

  // Обработчики событий из сетки объектов
  useEffect(() => {
    const handleEditAccommodation = (event) => {
      handleEditAccommodation(event.detail);
    };
    
    const handleDeleteAccommodation = (event) => {
      const accommodation = accommodations.find(acc => acc.id === event.detail);
      if (accommodation) {
        handleDeleteClick(accommodation);
      }
    };
    
    window.addEventListener('editAccommodation', handleEditAccommodation);
    window.addEventListener('deleteAccommodation', handleDeleteAccommodation);
    
    return () => {
      window.removeEventListener('editAccommodation', handleEditAccommodation);
      window.removeEventListener('deleteAccommodation', handleDeleteAccommodation);
    };
  }, [accommodations]);

  const handleAddAccommodation = () => {
    setEditingAccommodation(null);
    setFormData({
      name: '',
      description: '',
      address: '',
      price: ''
    });
    setErrors({});
    setShowForm(true);
  };

  const handleEditAccommodation = (accommodation) => {
    setEditingAccommodation(accommodation);
    setFormData({
      name: accommodation.name,
      description: accommodation.description || '',
      address: accommodation.address || '',
      price: accommodation.price.toString()
    });
    setErrors({});
    setShowForm(true);
  };

  const handleDeleteClick = (accommodation) => {
    setAccommodationToDelete(accommodation);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (accommodationToDelete) {
      const newAccommodations = accommodations.filter(acc => acc.id !== accommodationToDelete.id);
      onAccommodationsChange(newAccommodations);
      showNotification('Объект размещения успешно удален', 'success');
      setAccommodationToDelete(null);
    }
  };

  const handleSelectAccommodation = (accommodation) => {
    if (onAccommodationSelect) {
      onAccommodationSelect(accommodation);
      showNotification(`Выбран объект: ${accommodation.name}`, 'info');
    }
  };

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
      showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
      return;
    }
    
    const newAccommodation = {
      id: editingAccommodation ? editingAccommodation.id : Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      address: formData.address.trim(),
      price: Number(formData.price),
      bookings: editingAccommodation ? editingAccommodation.bookings : []
    };
    
    if (editingAccommodation) {
      // Редактирование существующего объекта
      const newAccommodations = accommodations.map(acc => 
        acc.id === editingAccommodation.id ? newAccommodation : acc
      );
      onAccommodationsChange(newAccommodations);
      showNotification('Объект размещения успешно обновлен', 'success');
    } else {
      // Добавление нового объекта
      onAccommodationsChange([...accommodations, newAccommodation]);
      showNotification('Новый объект размещения успешно добавлен', 'success');
    }
    
    // Сброс формы
    setShowForm(false);
    setEditingAccommodation(null);
    setFormData({
      name: '',
      description: '',
      address: '',
      price: ''
    });
    setErrors({});
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAccommodation(null);
    setFormData({
      name: '',
      description: '',
      address: '',
      price: ''
    });
    setErrors({});
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="accommodation-manager">
      <div className="manager-header">
        <h3>Список объектов размещения</h3>
        <Button 
          variant="primary" 
          onClick={handleAddAccommodation}
        >
          Добавить объект
        </Button>
      </div>
      
      {accommodations.length === 0 ? (
        <Card className="empty-state">
          <p>Пока нет объектов размещения</p>
        </Card>
      ) : (
        <div className="accommodations-list">
          {accommodations.map(accommodation => (
            <Card key={accommodation.id} className="accommodation-card">
              <div className="accommodation-header">
                <h4>{accommodation.name}</h4>
                <div className="accommodation-actions">
                  <Button 
                    variant="secondary"
                    size="small"
                    onClick={() => handleSelectAccommodation(accommodation)}
                  >
                    Выбрать для бронирования
                  </Button>
                  <Button 
                    variant="secondary"
                    size="small"
                    onClick={() => handleEditAccommodation(accommodation)}
                  >
                    ✏️
                  </Button>
                  <Button 
                    variant="danger"
                    size="small"
                    onClick={() => handleDeleteClick(accommodation)}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
              
              <div className="accommodation-details">
                {accommodation.description && (
                  <p className="description">{accommodation.description}</p>
                )}
                {accommodation.address && (
                  <p className="address">📍 {accommodation.address}</p>
                )}
                <p className="price">💰 {accommodation.price} ₽ за ночь</p>
              </div>
              
              {accommodation.bookings && accommodation.bookings.length > 0 && (
                <div className="bookings-section">
                  <h5>Бронирования:</h5>
                  <ul className="bookings-list">
                    {accommodation.bookings.map((booking, index) => (
                      <li key={index} className="booking-item">
                        <div className="booking-dates">
                          {booking.dates.map((date, dateIndex) => (
                            <span key={dateIndex} className="booking-date">
                              {formatDate(date)}
                            </span>
                          ))}
                        </div>
                        {booking.client && (
                          <div className="client-info">
                            <span className="client-name">{booking.client.fullName}</span>
                            <span className="client-phone">{booking.client.phone}</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      
      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingAccommodation ? 'Редактирование объекта' : 'Добавление нового объекта'}
        size="medium"
        actions={[
          <Button key="cancel" variant="secondary" onClick={handleCancel}>
            Отмена
          </Button>,
          <Button key="submit" variant="primary" onClick={handleSubmit}>
            {editingAccommodation ? 'Сохранить изменения' : 'Добавить объект'}
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
      
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setAccommodationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Удаление объекта размещения"
        message={`Вы уверены, что хотите удалить объект "${accommodationToDelete?.name}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        confirmVariant="danger"
      />
    </div>
  );
};

export default AccommodationManager;