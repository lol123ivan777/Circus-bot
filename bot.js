// Загружаем переменные окружения из .env
require('dotenv').config({ path: __dirname + '/.env' });
console.log('BOT TOKEN ===>', process.env.BOT_TOKEN);

const TelegramBot = require('node-telegram-bot-api');

// Клавиатуры и хэндлеры
const { mainMenuKeyboard } = require('./src/keyboards/mainMenu');
const { handleStart } = require('./src/handlers/start');
const { handleAbout } = require('./src/handlers/about');
const { handleNews } = require('./src/handlers/news');
const { handleArtists } = require('./src/handlers/artists');
const { handleSchedule } = require('./src/handlers/schedule');

// Создаём объект бота с polling
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
  },
});

// Логируем ошибки polling (если будут)
bot.on('polling_error', (err) => {
  console.error('POLLING ERROR:', err.message || err);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
  console.log('ON /start', msg.chat.id);
  handleStart(bot, msg);
});

// Обработка всех текстовых сообщений
bot.on('message', (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (!text) return;

  console.log('NEW MESSAGE ===>', text);

  if (text === '🎪 О цирке') return handleAbout(bot, chatId);
  if (text === '📰 Новости') return handleNews(bot, chatId);
  if (text === '🌟 Артисты') return handleArtists(bot, chatId);
  if (text === '🎭 Расписание') return handleSchedule(bot, chatId);

  if (text === '⬅️ Назад в меню') {
    return bot.sendMessage(chatId, 'Главное меню цирка Никулина:', mainMenuKeyboard);
  }
});

// Стартовый лог
console.log('Circus bot started');