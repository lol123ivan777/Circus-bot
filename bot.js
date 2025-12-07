// === Загрузка ENV ===
require('dotenv').config({ path: __dirname + '/.env' });
console.log('BOT TOKEN ===>', process.env.BOT_TOKEN);

// === Telegram Bot ===
const TelegramBot = require('node-telegram-bot-api');

// Хэндлеры
const { handleStart } = require('./src/handlers/start');
const { handleAbout } = require('./src/handlers/about');
const { handleNews } = require('./src/handlers/news');
const { handleArtists } = require('./src/handlers/artists');
const { handleSchedule } = require('./src/handlers/schedule');

// === Создаём бота ===
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true
  }
});

// Лог ошибок polling
bot.on('polling_error', err => {
  console.error('POLLING ERROR:', err.message || err);
});

// ========================================
// /start (генерирует стартовое сообщение)
// ========================================

bot.onText(/\/start/, msg => {
  handleStart(bot, msg.chat.id);
});

// ========================================
// Обработка callback_data (inline-кнопки)
// ========================================

bot.on('callback_query', async query => {
  try {
    const data = query.data;
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;

    console.log('CALLBACK ===>', data);

    // Главное меню
    if (data === 'back_to_menu') {
      return handleStart(bot, chatId, msgId); 
    }

    // Разделы
    if (data === 'about') {
      return handleAbout(bot, chatId, msgId);
    }

    if (data === 'news') {
      return handleNews(bot, chatId, msgId);
    }

    if (data === 'artists') {
      return handleArtists(bot, chatId, msgId);
    }

    if (data === 'schedule') {
      return handleSchedule(bot, chatId, msgId);
    }

  } catch (err) {
    console.error('CALLBACK ERROR:', err);
  }
});

// ========================================
// Фолбэк на сообщения (игнор)
bot.on('message', msg => {
  // Игнорим всё, чтобы не срать в чат
});

// ========================================
console.log('Circus Nikulin bot started');