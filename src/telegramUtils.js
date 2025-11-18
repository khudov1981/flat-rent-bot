import config from './config';

/**
 * Отправка сообщения через Telegram Bot API
 * @param {string} message - Текст сообщения
 * @returns {Promise<boolean>} - Успешность отправки сообщения
 */
export const sendTelegramMessage = async (message) => {
  try {
    // Проверяем, что сообщение не пустое
    if (!message || message.trim().length === 0) {
      console.warn('Попытка отправить пустое сообщение. Уведомление не отправлено.');
      return false;
    }

    // Проверяем, что токен и chat ID заданы
    if (!config.BOT_TOKEN || !config.ADMIN_CHAT_ID) {
      console.warn('Токен бота или ID чата администратора не заданы. Уведомление не отправлено.');
      return false;
    }

    // Формируем URL для отправки сообщения
    const url = `${config.TELEGRAM_API_BASE_URL}${config.BOT_TOKEN}/sendMessage`;
    
    // Параметры запроса
    const payload = {
      chat_id: config.ADMIN_CHAT_ID,
      text: message.trim(),
      parse_mode: 'Markdown',
    };

    // Отправляем запрос к Telegram Bot API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Проверяем статус ответа
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Ошибка при отправке сообщения через Telegram API: ${response.status} - ${response.statusText}`, errorData);
      return false;
    }

    // Проверяем успешность отправки сообщения
    const responseData = await response.json();
    if (!responseData.ok) {
      console.error('Telegram API вернул ошибку:', responseData.description);
      return false;
    }

    console.log('Уведомление успешно отправлено администратору через Telegram');
    return true;
  } catch (error) {
    console.error('Ошибка при отправке уведомления администратору:', error);
    return false;
  }
};

/**
 * Форматирование данных бронирования в текст сообщения
 * @param {Object} accommodation - Объект размещения
 * @param {Object} clientData - Данные клиента
 * @param {Array} dates - Массив дат бронирования
 * @param {number} totalPrice - Общая стоимость
 * @returns {string} - Отформатированный текст сообщения
 */
export const formatBookingNotification = (accommodation, clientData, dates, totalPrice) => {
  // Проверяем входные данные
  if (!accommodation || !clientData || !Array.isArray(dates) || dates.length === 0) {
    console.warn('Недостаточно данных для форматирования уведомления о бронировании');
    return '🔔 *Новое бронирование*

⚠️ Недостаточно данных для отображения';
  }

  try {
    // Форматируем даты для отображения
    const formattedDates = dates
      .sort((a, b) => a - b)
      .map(date => {
        // Проверяем, что date является допустимой датой
        if (!(date instanceof Date) || isNaN(date)) {
          return 'Недействительная дата';
        }
        return date.toLocaleDateString('ru-RU', { 
          day: 'numeric', 
          month: 'long',
          year: 'numeric'
        });
      })
      .join(', ');

    // Формируем сообщение для администратора
    return `
🔔 *Новое бронирование*

🏠 *Объект:* ${accommodation.name || 'Не указано'}
👤 *Клиент:* ${clientData.fullName || 'Не указано'}
📞 *Телефон:* ${clientData.phone || 'Не указано'}
📅 *Даты:* ${formattedDates}
🌙 *Количество ночей:* ${dates.length}
💰 *Сумма:* ${totalPrice || 0} ₽
    `.trim();
  } catch (error) {
    console.error('Ошибка при форматировании уведомления о бронировании:', error);
    return '🔔 *Новое бронирование*

⚠️ Ошибка при формировании данных о бронировании';
  }
};