// Конфигурационный файл для Telegram бота
const config = {
  // Токен Telegram бота (должен быть установлен в переменных окружения в production)
  BOT_TOKEN: import.meta.env.VITE_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE',
  
  // ID администратора, которому будут отправляться уведомления
  ADMIN_CHAT_ID: import.meta.env.VITE_ADMIN_CHAT_ID || 'YOUR_ADMIN_CHAT_ID_HERE',
  
  // Базовый URL для Telegram Bot API
  TELEGRAM_API_BASE_URL: 'https://api.telegram.org/bot',
  
  // Таймаут для запросов к API (в миллисекундах)
  API_TIMEOUT: 10000,
};

export default config;