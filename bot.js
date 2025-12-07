// bot.js
require('dotenv').config({ path: __dirname + '/.env' });

if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found in .env');
  process.exit(1);
}

console.log('BOT TOKEN ===>', process.env.BOT_TOKEN);

const TelegramBot = require('node-telegram-bot-api');

// Хэндлеры
const { handleStart } = require('./src/handlers/start');
const { handleAbout } = require('./src/handlers/about');
const { handleNews } = require('./src/handlers/news');
const { handleArtists } = require('./src/handlers/artists');
const { handleSchedule } = require('./src/handlers/schedule');

// Создаём бота
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: { interval: 300, autoStart: true }
});

// Универсальная безопасная обёртка
async function safeRun(fn, ...args) {
  try {
    await fn(...args);
  } catch (err) {
    console.error('HANDLER ERROR:', err?.stack || err);

    const q = args.find(a => a?.id && a?.data && a?.message);
    if (q) {
      try {
        await bot.answerCallbackQuery(q.id, {
          text: 'Ошибка, попробуйте ещё раз.',
          show_alert: false
        });
      } catch {}
    }
  }
}

// Ошибки polling
bot.on('polling_error', err => {
  console.error('POLLING ERROR:', err?.message || err);
});

// /start
bot.onText(/\/start/, msg => {
  safeRun(handleStart, bot, msg);
});

// callback_query
bot.on('callback_query', async query => {
  const data = query.data;
  console.log('CALLBACK ===>', data);

  try {
    if (data === 'back_to_menu') return safeRun(handleStart, bot, query);
    if (data === 'about')       return safeRun(handleAbout, bot, query);
    if (data === 'news')        return safeRun(handleNews, bot, query);
    if (data === 'artists')     return safeRun(handleArtists, bot, query);
    if (data === 'schedule')    return safeRun(handleSchedule, bot, query);

    // fallback (на всякий случай)
    await bot.answerCallbackQuery(query.id, { 
      text: 'Команда не распознана', 
      show_alert: false 
    });

  } catch (err) {
    console.error('CALLBACK ERROR:', err?.stack || err);
    try {
      await bot.answerCallbackQuery(query.id, { 
        text: 'Ошибка обработки', 
        show_alert: false 
      });
    } catch {}
  }
});

// Игнорируем обычные сообщения
bot.on('message', msg => {});

console.log('Circus Nikulin bot started');
module.exports = bot;