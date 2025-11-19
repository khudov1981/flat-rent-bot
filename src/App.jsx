import { useState, useEffect, useRef } from 'react'
import BottomNavigation from './components/BottomNavigation'
import AccommodationsPage from './AccommodationsPage'
import CalendarPage from './CalendarPage'
import TodayBookings from './TodayBookings'
import UserProfile from './components/UserProfile'
import SettingsPage from './components/SettingsPage'
import HelpPage from './components/HelpPage'
import NotificationsPage from './components/NotificationsPage'
import TasksPage from './components/TasksPage'
import Card from './components/Card'
import GuideTooltip from './components/GuideTooltip'
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
  const [currentGuideStep, setCurrentGuideStep] = useState(0)
  const accommodationsPageRef = useRef(null)

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      try {
        const webApp = window.Telegram.WebApp
        webApp.ready()
        
        // Проверяем, доступны ли данные пользователя
        if (webApp.initDataUnsafe && Object.keys(webApp.initDataUnsafe).length > 0 && webApp.initDataUnsafe.user) {
          setUser(webApp.initDataUnsafe.user)
        } else {
          // Используем тестовые данные, если данные пользователя недоступны
          setUser({
            id: 123456,
            first_name: 'Тестовый',
            last_name: 'Пользователь',
            username: 'testuser'
          })
        }
        
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
      const today = new Date().toISOString().split('T')[0];
      
      const testAccommodations = [
        {
          id: '1',
          name: 'Тестовая квартира',
          description: 'Уютная квартира в центре города',
          address: 'ул. Тестовая, д. 1',
          price: 2500,
          bookings: [
            {
              id: '1',
              dates: [today],
              client: {
                fullName: 'Иван Иванов',
                phone: '+7 (999) 123-45-67'
              },
              createdAt: new Date().toISOString()
            }
          ]
        }
      ]
      setAccommodations(testAccommodations)
      setSelectedAccommodation(testAccommodations[0])
    }
    
    setLoading(false)
  }, [])

  // Обработчик события navigateToTab из компонента профиля
  useEffect(() => {
    const handleNavigateToTab = (event) => {
      const tab = event.detail;
      if (tab) {
        setActiveTab(tab);
      }
    };

    window.addEventListener('navigateToTab', handleNavigateToTab);

    return () => {
      window.removeEventListener('navigateToTab', handleNavigateToTab);
    };
  }, []);

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

  // Управление обучающим гидом
  const handleNextGuideStep = () => {
    if (currentGuideStep === 0) {
      // Переход с первого шага на второй - переключаем вкладку на "accommodations"
      setActiveTab('accommodations')
    } else if (currentGuideStep === 1) {
      // Переход со второго шага на третий - переключаем вкладку на "calendar"
      setActiveTab('calendar')
    }
    setCurrentGuideStep(prev => prev + 1)
  }

  const handlePrevGuideStep = () => {
    if (currentGuideStep === 2) {
      // Переход с третьего шага на второй - переключаем вкладку на "accommodations"
      setActiveTab('accommodations')
    } else if (currentGuideStep === 1) {
      // Переход со второго шага на первый - переключаем вкладку на "home"
      setActiveTab('home')
    }
    setCurrentGuideStep(prev => Math.max(0, prev - 1))
  }

  const handleCompleteGuide = () => {
    setCurrentGuideStep(0)
    // После завершения гида возвращаемся на домашнюю вкладку
    setActiveTab('home')
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
            <div>
              <UserProfile 
                user={user}
                onSettingsChange={handleSettingsChange}
              />
            </div>
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
        
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        {/* Обучающий гид отключен по запросу пользователя
        {activeTab === 'home' && (
          <GuideTooltip
            id="home-guide"
            title="Добро пожаловать!"
            content="Это главная страница приложения. Здесь вы можете видеть все сегодняшние бронирования."
            position="top"
            showOnLoad={currentGuideStep === 0}
            onNext={handleNextGuideStep}
            step={1}
            totalSteps={3}
          />
        )}
        
        {activeTab === 'accommodations' && (
          <GuideTooltip
            id="accommodations-guide"
            title="Управление объектами"
            content="Здесь вы можете добавлять, редактировать и удалять объекты размещения. Нажмите 'Добавить объект', чтобы создать новый."
            position="top"
            showOnLoad={currentGuideStep === 1}
            onNext={handleNextGuideStep}
            onPrev={handlePrevGuideStep}
            step={2}
            totalSteps={3}
          />
        )}
        
        {activeTab === 'calendar' && selectedAccommodation && (
          <GuideTooltip
            id="calendar-guide"
            title="Календарь бронирования"
            content="Выберите даты для бронирования. Забронированные даты отмечены красным цветом."
            position="top"
            showOnLoad={currentGuideStep === 2}
            onPrev={handlePrevGuideStep}
            onComplete={handleCompleteGuide}
            step={3}
            totalSteps={3}
            isLastStep={true}
          />
        )}
        */}
      </div>
    </NotificationProvider>
  )
}

export default App