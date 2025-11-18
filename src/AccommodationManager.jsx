import React, { useState } from 'react';
import './AccommodationManager.css';

const AccommodationManager = ({ accommodations, onAccommodationsChange, onAccommodationSelect }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    price: ''
  });
  const [errors, setErrors] = useState({});

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

  const handleDeleteAccommodation = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект размещения?')) {
      const newAccommodations = accommodations.filter(acc => acc.id !== id);
      onAccommodationsChange(newAccommodations);
    }
  };

  const handleSelectAccommodation = (accommodation) => {
    if (onAccommodationSelect) {
      onAccommodationSelect(accommodation);
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
    } else {
      // Добавление нового объекта
      onAccommodationsChange([...accommodations, newAccommodation]);
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
      {!showForm ? (
        <>
          <div className="manager-header">
            <h3>Список объектов размещения</h3>
            <button 
              className="add-button"
              onClick={handleAddAccommodation}
            >
              Добавить объект
            </button>
          </div>
          
          {accommodations.length === 0 ? (
            <div className="empty-state">
              <p>Пока нет объектов размещения</p>
            </div>
          ) : (
            <div className="accommodations-list">
              {accommodations.map(accommodation => (
                <div key={accommodation.id} className="accommodation-card">
                  <div className="accommodation-header">
                    <h4>{accommodation.name}</h4>
                    <div className="accommodation-actions">
                      <button 
                        className="select-button"
                        onClick={() => handleSelectAccommodation(accommodation)}
                      >
                        Выбрать для бронирования
                      </button>
                      <button 
                        className="edit-button"
                        onClick={() => handleEditAccommodation(accommodation)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteAccommodation(accommodation.id)}
                      >
                        🗑️
                      </button>
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
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="form-container">
          <div className="form-header">
            <h3>{editingAccommodation ? 'Редактирование объекта' : 'Добавление нового объекта'}</h3>
            <p>Заполните информацию об объекте размещения</p>
          </div>
          
          <form onSubmit={handleSubmit} className="accommodation-form">
            <div className="form-group">
              <label htmlFor="name">Название объекта *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Уютная квартира в центре города"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Описание объекта размещения..."
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Адрес</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Адрес объекта"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Цена за ночь (₽) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="1000"
                min="1"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleCancel}
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="submit-button"
              >
                {editingAccommodation ? 'Сохранить изменения' : 'Добавить объект'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccommodationManager;