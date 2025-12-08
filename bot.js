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
    // ответим пользователю, если это callback_query
    const maybeQuery = args.find(a => a && a.id && a.data && a.message);
    if (maybeQuery && maybeQuery.id) {
      try {
        await bot.answerCallbackQuery(maybeQuery.id, { text: 'Ошибка: попробуйте ещё раз', show_alert: false });
      } catch (e) { /* noop */ }
    }
  }
}

console.log('Circus Nikulin bot starting...');

// /start command
bot.onText(/\/start/, msg => safeRun(handleStart, bot, msg));

// central callback router
bot.on('callback_query', async (query) => {
  const data = query?.data;
  const msgId = query?.message?.message_id;

  console.log('CALLBACK:', data);


  // routing: exact commands
  if (data === 'back_to_menu' || data === 'main_menu') {
    return safeRun(handleStart, bot, query, msgId);
  }

  if (data === 'about') return safeRun(handleAbout, bot, query);

  if (data && data.startsWith('news')) return safeRun(handleNews, bot, query);

  if (data && data.startsWith('artists')) return safeRun(handleArtists, bot, query);

  if (data === 'schedule' || (data && data.startsWith('schedule_month:'))) {
    return safeRun(handleSchedule, bot, query);
  }

  if (data === 'tickets') return safeRun(handleTickets, bot, query);

  if (data === 'contacts') return safeRun(handleContacts, bot, query);

  if (data === 'programs') return safeRun(handlePrograms, bot, query);

  if (data === 'festival') return safeRun(handleFestival, bot, query);

if (data === 'genres') return safeRun(handleGenres, bot, query);

if (data.startsWith('genre:')) {
  const id = data.split(':')[1];
  return safeRun(handleGenreItem, bot, query, id);
}

  // unknown
  try {
    await bot.answerCallbackQuery(query.id, { text: 'Команда не распознана', show_alert: false });
  } catch (e) { /* noop */ }
});

// ignore plain messages except /start above
bot.on('message', () => {});

module.exports = bot;