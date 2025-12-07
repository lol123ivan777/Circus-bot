// bot.js
// === Загрузка ENV ===
require('dotenv').config({ path: __dirname + '/.env' });

// Проверка токена — если нет, сразу падаем с понятным сообщением
if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found in .env. Add BOT_TOKEN=xxx and restart.');
  process.exit(1);
}

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

// Простая async-обёртка для безопасного запуска хэндлеров
async function safeRun(fn, ...args) {
  try {
    await fn(...args);
  } catch (err) {
    // Логируем полный стек — пригодится при отладке
    console.error('HANDLER ERROR:', err && err.stack ? err.stack : err);

    // Если вызов пришёл из callback_query — ответим аккуратно пользователю
    const maybeQuery = args.find(a => a && a.id && a.data && a.message);
    if (maybeQuery && maybeQuery.id) {
      try {
        await bot.answerCallbackQuery(maybeQuery.id, {
          text: 'Произошла ошибка, попробуйте ещё раз.',
          show_alert: false
        });
      } catch (e) {
        // Ничего не делаем — это вторичная ошибка при ответе
        console.error('Failed to answer callback query:', e && e.message ? e.message : e);
      }
    }
  }
}

// Лог ошибок polling
bot.on('polling_error', err => {
  console.error('POLLING ERROR:', err && err.message ? err.message : err);
});

// ========================================
// /start (генерирует стартовое сообщение)
// ========================================
// Передаём весь msg в handleStart — он уже умеет разбирать msg / callback input
bot.onText(/\/start/, msg => {
  safeRun(handleStart, bot, msg, null);
});

// ========================================
// Обработка callback_data (inline-кнопки)
// ========================================
bot.on('callback_query', async query => {
  const data = query && query.data;
  const chatId = query && query.message && query.message.chat && query.message.chat.id;
  const msgId = query && query.message && query.message.message_id;

  console.log('CALLBACK ===>', data);

  try {
    // Разбор известных callback'ов
    if (data === 'back_to_menu') return safeRun(handleStart, bot, query, msgId);
    if (data === 'about') return safeRun(handleAbout, bot, query, msgId);
    if (data === 'news') return safeRun(handleNews, bot, query, msgId);
    if (data === 'artists') return safeRun(handleArtists, bot, query, msgId);
    if (data === 'schedule') return safeRun(handleSchedule, bot, query, msgId);

    // Если это пагинация или другие callback'ы — передаём всем хэндлерам (они должны внутри решать)
    // Но если ничего не подошло — корректно отвечаем пользователю
    await bot.answerCallbackQuery(query.id, { text: 'Действие не распознано', show_alert: false });
  } catch (err) {
    // Безопасная обработка ошибок — используем safeRun (чтобы унифицировать)
    console.error('CALLBACK ERROR (outer):', err && err.stack ? err.stack : err);
    try {
      if (query && query.id) {
        await bot.answerCallbackQuery(query.id, { text: 'Ошибка обработки, попробуйте снова', show_alert: false });
      }
    } catch (e) { /* noop */ }
  }
});

// ========================================
// Фолбэк на обычные сообщения (игнорируем,
// чтобы чат не засирался спамом от прошлых кнопок)
// ========================================
bot.on('message', msg => {
  // intentionally empty
});

// ========================================
console.log('Circus Nikulin bot started');

module.exports = bot;