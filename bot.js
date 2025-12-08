// bot.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found in .env (см. .env.example)');
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// handlers
const { handleStart } = require('./src/handlers/start');
const { handleAbout } = require('./src/handlers/about');
const { handleNews } = require('./src/handlers/news');
const { handleArtists } = require('./src/handlers/artists');
const { handleSchedule } = require('./src/handlers/schedule');
const { handleTickets } = require('./src/handlers/tickets');
const { handleContacts } = require('./src/handlers/contacts');
const { handlePrograms } = require('./src/handlers/programs');
const { handleFestival } = require('./src/handlers/festival');
const { handleGenres, handleGenreItem } = require('./src/handlers/genres');

async function safeRun(fn, ...args) {
  try {
    await fn(...args);
  } catch (err) {
    console.error('HANDLER ERROR:', err?.stack || err);
    const maybeQuery = args.find(a => a && a.id && a.data && a.message);
    if (maybeQuery && maybeQuery.id) {
      try {
        await bot.answerCallbackQuery(maybeQuery.id, {
          text: 'Ошибка: попробуйте ещё раз',
          show_alert: false
        });
      } catch (e) {}
    }
  }
}

console.log('Circus Nikulin bot starting...');

// /start командa
bot.onText(/\/start/, msg => safeRun(handleStart, bot, msg));

// центральный роутер callback_query
const { handleStart } = require('./src/handlers/start');

const { handleAbout } = require('./src/handlers/about');

const { handleNews } = require('./src/handlers/news');

const { handleArtists, handleArtistsPage } = require('./src/handlers/artists');

const { handleSchedule } = require('./src/handlers/schedule');

const { handleTickets } = require('./src/handlers/tickets');

const { handleContacts } = require('./src/handlers/contacts');

const { handlePrograms } = require('./src/handlers/programs');

const { handleFestival } = require('./src/handlers/festival');

const { handleGenres, handleGenreItem } = require('./src/handlers/genres');

  try {
    await bot.answerCallbackQuery(query.id, {
      text: 'Команда не распознана',
      show_alert: false
    });
  } catch (e) {}
});

// игнорируем обычные сообщения кроме /start
bot.on('message', (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;
});

module.exports = bot;