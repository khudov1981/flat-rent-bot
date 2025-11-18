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

// Валидация конфигурации
const validateConfig = () => {
  const errors = [];
  
  // Проверка BOT_TOKEN
  if (!config.BOT_TOKEN || config.BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    console.warn('ПРЕДУПРЕЖДЕНИЕ: BOT_TOKEN не установлен или содержит значение по умолчанию');
  } else if (typeof config.BOT_TOKEN !== 'string' || !/^[a-zA-Z0-9_:]+$/.test(config.BOT_TOKEN)) {
    errors.push('BOT_TOKEN должен быть строкой и содержать только буквы, цифры, подчеркивание и двоеточие');
  }
  
  // Проверка ADMIN_CHAT_ID
  if (!config.ADMIN_CHAT_ID || config.ADMIN_CHAT_ID === 'YOUR_ADMIN_CHAT_ID_HERE') {
    console.warn('ПРЕДУПРЕЖДЕНИЕ: ADMIN_CHAT_ID не установлен или содержит значение по умолчанию');
  } else {
    const chatId = String(config.ADMIN_CHAT_ID);
    if (!/^-?\d+$/.test(chatId)) {
      errors.push('ADMIN_CHAT_ID должен быть числом или строкой, содержащей только цифры (может начинаться с минуса)');
    }
  }
  
  // Проверка TELEGRAM_API_BASE_URL
  if (!config.TELEGRAM_API_BASE_URL || typeof config.TELEGRAM_API_BASE_URL !== 'string') {
    errors.push('TELEGRAM_API_BASE_URL должен быть непустой строкой');
  } else if (!config.TELEGRAM_API_BASE_URL.startsWith('http')) {
    errors.push('TELEGRAM_API_BASE_URL должен начинаться с http или https');
  }
  
  // Проверка API_TIMEOUT
  if (typeof config.API_TIMEOUT !== 'number' || config.API_TIMEOUT <= 0) {
    errors.push('API_TIMEOUT должен быть положительным числом');
  }
  
  // Вывод ошибок валидации
  if (errors.length > 0) {
    console.error('Ошибки конфигурации:');
    errors.forEach((error, index) => {
      console.error(`  ${index + 1}. ${error}`);
    });
  }
  
  return errors.length === 0;
};

// Выполняем валидацию при загрузке модуля
validateConfig();

export default config;