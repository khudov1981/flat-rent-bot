import { Telegraf } from "telegraf";
import config from "./config.js";
import {
  sendTelegramMessage,
  formatBookingNotification,
} from "./telegramUtils.js";

// Константы
const APP_URL = "https://khudov1981-flat-rent-bot-6b7d.twc1.net/";
const START_MESSAGE =
  "Привет! Я бот для управления бронированиями. Напишите /help для получения списка команд.";
const HELP_MESSAGE = `Доступные команды:
/start - Начать работу с ботом
/help - Получить список команд
/book - Забронировать даты`;

// Создаем экземпляр бота
const bot = new Telegraf(config.BOT_TOKEN);

// Функция для безопасной отправки сообщений с обработкой ошибок
const safeReply = async (ctx, message) => {
  try {
    await ctx.reply(message);
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
  }
};

// Обработчик команды /start
bot.start(async (ctx) => {
  await ctx.reply(START_MESSAGE, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть приложение для бронирования",
            url: APP_URL,
          },
        ],
        [
          {
            text: "Как пользоваться ботом",
            callback_data: "help",
          },
        ],
      ],
    },
  });
});

// Обработчик команды /help
bot.help(async (ctx) => {
  await safeReply(ctx, HELP_MESSAGE);
});

// Обработчик команды /book
bot.command("book", async (ctx) => {
  await ctx.reply("Для бронирования дат воспользуйтесь нашим приложением:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть приложение для бронирования",
            url: APP_URL,
          },
        ],
      ],
    },
  });
});

// Обработчик callback-кнопки помощи
bot.action("help", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(HELP_MESSAGE);
});

// Обработчик текстовых сообщений
bot.on("text", async (ctx) => {
  await safeReply(
    ctx,
    "Извините, я не понимаю текстовые сообщения. Пожалуйста, используйте команды или наше приложение для бронирования."
  );
});

// Обработчик ошибок бота
bot.catch((err, ctx) => {
  console.error(`Ошибка бота для ${ctx.updateType}`, err);
});

// Запуск бота с обработкой ошибок
const startBot = async () => {
  try {
    await bot.launch();
    console.log("Telegram bot is running...");
  } catch (error) {
    console.error("Ошибка запуска бота:", error);
    process.exit(1);
  }
};

startBot();

// Включаем плавное завершение
process.once("SIGINT", () => {
  console.log("Получен сигнал SIGINT. Завершение работы бота...");
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  console.log("Получен сигнал SIGTERM. Завершение работы бота...");
  bot.stop("SIGTERM");
});
