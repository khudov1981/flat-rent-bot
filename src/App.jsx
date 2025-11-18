import { useState, useEffect, useRef } from 'react'
import AppNavigation from './components/AppNavigation'
import AccommodationsPage from './AccommodationsPage'
import CalendarPage from './CalendarPage'
import TodayBookings from './TodayBookings'
import UserProfile from './components/UserProfile'
import SettingsPage from './components/SettingsPage'
import HelpPage from './components/HelpPage'
import NotificationsPage from './components/NotificationsPage'
import TasksPage from './components/TasksPage'
import Card from './components/Card'
import { NotificationProvider } from './contexts/NotificationContext'
import './contexts/NotificationContext.css'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [accommodations, setAccommodations] = useState([])
  const [selectedAccommodation, setSelectedAccommodation] = useState(null)
  const [activeTab, setActiveTab] = useState('home') // По умолчанию показываем домашний экран
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    notifications: true,
    language: 'ru'
  })
  const accommodationsPageRef = useRef(null)

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      try {
        const webApp = window.Telegram.WebApp
        webApp.ready()
        setUser(webApp.initDataUnsafe.user)
        
        // Загрузка данных из localStorage
        const savedAccommodations = localStorage.getItem('accommodations')
        if (savedAccommodations) {
          try {
            const parsedAccommodations = JSON.parse(savedAccommodations)
            setAccommodations(parsedAccommodations)
            
            // Установка первого объекта размещения по умолчанию
            if (parsedAccommodations.length > 0 && !selectedAccommodation) {
              setSelectedAccommodation(parsedAccommodations[0])
            }
          } catch (e) {
            console.error('Ошибка при загрузке объектов размещения:', e)
            setError('Ошибка при загрузке данных')
          }
        }
        
        // Загрузка настроек из localStorage
        const savedSettings = localStorage.getItem('appSettings')
        if (savedSettings) {
          try {
            setAppSettings(JSON.parse(savedSettings))
          } catch (e) {
            console.error('Ошибка при загрузке настроек:', e)
          }
        }
      } catch (e) {
        console.error('Ошибка инициализации Telegram Web App:', e)
        setError('Ошибка инициализации приложения')
      }
    } else {
      // Для тестирования в браузере
      setUser({
        id: 123456,
        first_name: 'Тестовый',
        last_name: 'Пользователь',
        username: 'testuser'
      })
      
      // Загрузка тестовых данных
      const testAccommodations = [
        {
          id: '1',
          name: 'Тестовая квартира',
          description: 'Уютная квартира в центре города',
          address: 'ул. Тестовая, д. 1',
          price: 2500,
          bookings: []
        }
      ]
      setAccommodations(testAccommodations)
      setSelectedAccommodation(testAccommodations[0])
    }
    
    setLoading(false)
  }, [])

  // Сохранение объектов размещения в localStorage при изменении
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('accommodations', JSON.stringify(accommodations))
    }
  }, [accommodations, loading])

  // Сохранение настроек в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings))
  }, [appSettings])

  // Установка первого объекта размещения по умолчанию при загрузке
  useEffect(() => {
    if (accommodations.length > 0 && !selectedAccommodation) {
      setSelectedAccommodation(accommodations[0])
    }
  }, [accommodations, selectedAccommodation])

  const handleAccommodationsChange = (newAccommodations) => {
    setAccommodations(newAccommodations)
    
    // Если выбранного объекта больше нет, сбросим выбор
    if (selectedAccommodation && !newAccommodations.find(acc => acc.id === selectedAccommodation.id)) {
      setSelectedAccommodation(newAccommodations.length > 0 ? newAccommodations[0] : null)
    }
  }

  const handleAccommodationSelect = (accommodation) => {
    setSelectedAccommodation(accommodation)
    // При выборе объекта автоматически переключаемся на календарь
    setActiveTab('calendar')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleSettingsChange = (newSettings) => {
    setAppSettings(newSettings)
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка приложения...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <Card>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Повторить попытку</button>
        </Card>
      </div>
    )
  }

  return (
    <NotificationProvider>
      <div className="App">
        <div className="header">
          {user && (
            <Card className="user-info">
              <p>Привет, {user.first_name}!</p>
            </Card>
          )}
        </div>
        
        <div className="navigation">
          <AppNavigation 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
        
        <div className="content">
          {activeTab === 'home' && (
            <TodayBookings 
              accommodations={accommodations}
              onAccommodationSelect={handleAccommodationSelect}
            />
          )}
          
          {activeTab === 'accommodations' && (
            <div ref={accommodationsPageRef}>
              <AccommodationsPage 
                accommodations={accommodations}
                onAccommodationsChange={handleAccommodationsChange}
                onAccommodationSelect={handleAccommodationSelect}
              />
            </div>
          )}
          
          {activeTab === 'calendar' && (
            <CalendarPage 
              selectedAccommodation={selectedAccommodation}
            />
          )}
          
          {activeTab === 'tasks' && (
            <TasksPage />
          )}
          
          {activeTab === 'profile' && user && (
            <UserProfile 
              user={user}
              onSettingsChange={handleSettingsChange}
            />
          )}
          
          {activeTab === 'notifications' && (
            <NotificationsPage />
          )}
          
          {activeTab === 'settings' && (
            <SettingsPage 
              onSettingsChange={handleSettingsChange}
            />
          )}
          
          {activeTab === 'help' && (
            <HelpPage />
          )}
        </div>
      </div>
    </NotificationProvider>
  )
}

export default App