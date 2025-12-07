// bot.js
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

const { inlineMenuKeyboard } = require('./src/keyboards/inlineMenu');

// === Создаём бота ===
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true
  }
});

// Простая обёртка для безопасного запуска async хэндлеров
async function safeRun(fn, ...args) {
  try {
    await fn(...args);
  } catch (err) {
    console.error('HANDLER ERROR:', err && err.stack ? err.stack : err);
    // Если это был callback_query — пробуем ответить пользователю коротким уведомлением
    const maybeQuery = args.find(a => a && a.data && a.message);
    if (maybeQuery && maybeQuery.id) {
      try {
        await bot.answerCallbackQuery(maybeQuery.id, { text: 'Ошибка: попробуйте ещё раз', show_alert: false });
      } catch (e) { /* ничего */ }
    }
  }
}

// Лог ошибок polling
bot.on('polling_error', err => {
  console.error('POLLING ERROR:', err.message || err);
});

// ========================================
// /start (генерирует стартовое сообщение)
// ========================================
bot.onText(/\/start/, msg => {
  // Передаём весь msg — хэндлер сам разберётся: /start через кнопку или как команда
  safeRun(handleStart, bot, msg, null);
});

// ========================================
// Обработка callback_data (inline-кнопки)
// ========================================
bot.on('callback_query', async query => {
  // query: { id, from, data, message, ... }
  const data = query.data;
  const chatId = query.message && query.message.chat && query.message.chat.id;
  const msgId = query.message && query.message.message_id;

  console.log('CALLBACK ===>', data);

  // Передаём query как первый парамет (чтобы хэндлер получил исходную структуру, если нужно)
  if (data === 'back_to_menu') return safeRun(handleStart, bot, query, msgId);
  if (data === 'about') return safeRun(handleAbout, bot, query, msgId);
  if (data === 'news') return safeRun(handleNews, bot, query, msgId);
  if (data === 'artists') return safeRun(handleArtists, bot, query, msgId);
  if (data === 'schedule') return safeRun(handleSchedule, bot, query, msgId);

  // Пагинация и другие callback'ы будут обрабатываться внутри соответствующих хэндлеров.
});

// ========================================
// Фолбэк на сообщения (игнор)
bot.on('message', msg => {
  // ничего не делаем с простыми сообщениями — только кнопки/команды
});

// ========================================
console.log('Circus Nikulin bot started');
module.exports = bot;