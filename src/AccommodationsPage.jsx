import React, { useState, useMemo, useCallback } from 'react';
import AccommodationManager from './AccommodationManager';
import AccommodationGrid from './components/AccommodationGrid';
import Card from './components/Card';
import Input from './components/Input';
import Button from './components/Button';
import StatWidget from './components/StatWidget';
import './AccommodationsPage.css';

const AccommodationsPage = ({ accommodations = [], onAccommodationsChange, onAccommodationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'bookings'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Проверка валидности пропсов
  const isValidProps = useMemo(() => {
    return Array.isArray(accommodations);
  }, [accommodations]);

  // Фильтрация и сортировка объектов (мемоизировано)
  const filteredAndSortedAccommodations = useMemo(() => {
    if (!isValidProps) return [];
    
    let filtered = [...accommodations];
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(acc => 
        acc && (
          (acc.name && acc.name.toLowerCase().includes(query)) ||
          (acc.description && acc.description.toLowerCase().includes(query)) ||
          (acc.address && acc.address.toLowerCase().includes(query))
        )
      );
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      try {
        let comparison = 0;
        
        switch (sortBy) {
          case 'price':
            comparison = (a.price || 0) - (b.price || 0);
            break;
          case 'bookings':
            const aBookings = Array.isArray(a.bookings) ? a.bookings.length : 0;
            const bBookings = Array.isArray(b.bookings) ? b.bookings.length : 0;
            comparison = aBookings - bBookings;
            break;
          case 'name':
          default:
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            comparison = nameA.localeCompare(nameB, 'ru');
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      } catch (error) {
        console.error('Ошибка сортировки объектов:', error);
        return 0;
      }
    });
    
    return filtered;
  }, [accommodations, isValidProps, searchQuery, sortBy, sortOrder]);

  // Вычисление статистики по всем объектам (мемоизировано)
  const overallStats = useMemo(() => {
    if (!isValidProps) {
      return {
        totalObjects: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averagePrice: 0
      };
    }

    try {
      const totalObjects = accommodations.length;
      let totalBookings = 0;
      let totalRevenue = 0;
      let totalPrice = 0;
      let validPrices = 0;

      accommodations.forEach(acc => {
        if (acc) {
          // Подсчет бронирований и дохода
          if (Array.isArray(acc.bookings)) {
            totalBookings += acc.bookings.length;
            acc.bookings.forEach(booking => {
              if (booking && Array.isArray(booking.dates)) {
                const nights = booking.dates.length;
                totalRevenue += nights * (acc.price || 0);
              }
            });
          }
          
          // Подсчет средней цены
          if (typeof acc.price === 'number' && acc.price > 0) {
            totalPrice += acc.price;
            validPrices++;
          }
        }
      });

      const averagePrice = validPrices > 0 ? totalPrice / validPrices : 0;

      return {
        totalObjects,
        totalBookings,
        totalRevenue,
        averagePrice: averagePrice.toFixed(0)
      };
    } catch (error) {
      console.error('Ошибка расчета общей статистики:', error);
      return {
        totalObjects: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averagePrice: 0
      };
    }
  }, [accommodations, isValidProps]);

  // Обработчик изменения сортировки
  const handleSortChange = useCallback((newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  // Получение иконки сортировки
  const getSortIcon = useCallback((field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  }, [sortBy, sortOrder]);

  // Обработчик редактирования объекта (улучшенная версия)
  const handleEditAccommodation = useCallback((accommodation) => {
    if (!accommodation || typeof accommodation !== 'object') {
      console.error('Некорректный объект для редактирования');
      return;
    }

    try {
      const event = new CustomEvent('editAccommodation', { detail: accommodation });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Ошибка при редактировании объекта:', error);
      // Альтернативный способ
      if (typeof window.handleEditAccommodation === 'function') {
        window.handleEditAccommodation(accommodation);
      }
    }
  }, []);

  // Обработчик удаления объекта (улучшенная версия)
  const handleDeleteAccommodation = useCallback((id) => {
    if (!id) {
      console.error('Некорректный ID для удаления');
      return;
    }

    try {
      const event = new CustomEvent('deleteAccommodation', { detail: id });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Ошибка при удалении объекта:', error);
      // Альтернативный способ
      if (typeof window.handleDeleteAccommodation === 'function') {
        window.handleDeleteAccommodation(id);
      }
    }
  }, []);

  // Форматирование валюты
  const formatCurrency = useCallback((amount) => {
    try {
      return `${Math.round(amount).toLocaleString('ru-RU')} ₽`;
    } catch (error) {
      return `${amount} ₽`;
    }
  }, []);

  return (
    <div className="accommodations-page">
      <div className="page-header">
        <h2>Управление объектами размещения</h2>
        <p>Добавляйте, редактируйте и удаляйте объекты размещения</p>
      </div>
      
      {/* Статистика по всем объектам */}
      <div className="accommodations-stats">
        <StatWidget
          title="Всего объектов"
          value={overallStats.totalObjects}
          icon="🏨"
          color="blue"
        />
        <StatWidget
          title="Бронирований"
          value={overallStats.totalBookings}
          icon="📅"
          color="green"
        />
        <StatWidget
          title="Общий доход"
          value={formatCurrency(overallStats.totalRevenue)}
          icon="💰"
          color="purple"
        />
        <StatWidget
          title="Средняя цена"
          value={formatCurrency(overallStats.averagePrice)}
          icon="📊"
          color="orange"
        />
      </div>
      
      <Card className="accommodations-page__content">
        <AccommodationManager 
          accommodations={accommodations}
          onAccommodationsChange={onAccommodationsChange}
          onAccommodationSelect={onAccommodationSelect}
        />
      </Card>
      
      <div className="page-header">
        <h2>Все объекты размещения</h2>
        <div className="accommodations-controls">
          <div className="search-controls">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по объектам..."
              className="search-input"
            />
            <span className="results-count">
              Найдено: {filteredAndSortedAccommodations.length}
            </span>
          </div>
          
          <div className="sort-controls">
            <span>Сортировка:</span>
            <Button 
              variant="secondary"
              size="small"
              onClick={() => handleSortChange('name')}
            >
              По названию {getSortIcon('name')}
            </Button>
            <Button 
              variant="secondary"
              size="small"
              onClick={() => handleSortChange('price')}
            >
              По цене {getSortIcon('price')}
            </Button>
            <Button 
              variant="secondary"
              size="small"
              onClick={() => handleSortChange('bookings')}
            >
              По бронированиям {getSortIcon('bookings')}
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="accommodations-page__content">
        <AccommodationGrid
          accommodations={filteredAndSortedAccommodations}
          onAccommodationSelect={onAccommodationSelect}
          onEditAccommodation={handleEditAccommodation}
          onDeleteAccommodation={handleDeleteAccommodation}
        />
      </Card>
    </div>
  );
};

export default React.memo(AccommodationsPage);