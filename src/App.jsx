import { useState, useEffect, useRef } from 'react'
import BottomNavigation from './BottomNavigation'
import AccommodationsPage from './AccommodationsPage'
import CalendarPage from './CalendarPage'
import TodayBookings from './TodayBookings'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [accommodations, setAccommodations] = useState([])
  const [selectedAccommodation, setSelectedAccommodation] = useState(null)
  const [activeTab, setActiveTab] = useState('home') // По умолчанию показываем домашний экран
  const accommodationsPageRef = useRef(null)

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp
      webApp.ready()
      setUser(webApp.initDataUnsafe.user)
    }
  }, [])

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

  const handleAddAccommodation = () => {
    setActiveTab('accommodations')
    // Прокручиваем к форме добавления объекта, если она существует
    setTimeout(() => {
      if (accommodationsPageRef.current) {
        const formContainer = accommodationsPageRef.current.querySelector('.form-container');
        if (formContainer) {
          formContainer.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  }

  const handleHome = () => {
    setActiveTab('home')
  }

  return (
    <div className="App">
      <div className="header">
        {user && (
          <div className="user-info">
            <p>Привет, {user.first_name}!</p>
          </div>
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
      </div>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onHome={handleHome}
      />
    </div>
  )
}

export default App