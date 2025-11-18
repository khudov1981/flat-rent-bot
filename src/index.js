import { Telegraf } from 'telegraf';
import config from './config.js';
import { sendTelegramMessage, formatBookingNotification } from './telegramUtils.js';

// Создаем экземпляр бота
const bot = new Telegraf(config.BOT_TOKEN);

// Обработчик команды /start
bot.start((ctx) => {
  ctx.reply('Привет! Я бот для управления бронированиями. Напишите /help для получения списка команд.');
});

// Обработчик команды /help
bot.help((ctx) => {
  ctx.reply('Доступные команды:
/start - Начать работу с ботом
/help - Получить список команд
/book - Забронировать даты');
});

// Обработчик команды /book
bot.command('book', (ctx) => {
  ctx.reply('Для бронирования дат, пожалуйста, используйте наше приложение. Вы можете получить к нему доступ по ссылке: https://smsforward2.sourcecraft.site/flat-rent-bot');
});

// Обработчик текстовых сообщений
bot.on('text', (ctx) => {
  ctx.reply('Извините, я не понимаю текстовые сообщения. Пожалуйста, используйте команды или наше приложение для бронирования.');
});

// Запуск бота
bot.launch();

// Включаем плавное завершение
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Telegram bot is running...');