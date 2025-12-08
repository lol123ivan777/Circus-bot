// bot.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found in .env');
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ===== HANDLERS =====
const { handleStart } = require('./src/handlers/start');
const { handleAbout } = require('./src/handlers/about');
const { handleNews } = require('./src/handlers/news');
const { handleArtists } = require('./src/handlers/artists');
const { handleSchedule } = require('./src/handlers/schedule');
const { handleTickets } = require('./src/handlers/tickets');
const { handleContacts } = require('./src/handlers/contacts');
const { handlePrograms } = require('./src/handlers/programs');
const { handleFestival } = require('./src/handlers/festival');

// Жанры + ИИ-генерация
const { 
  handleGenres, 
  handleGenreItem, 
  handleGenreMix 
} = require('./src/handlers/genres');

// ===== SAFE WRAPPER =====
async function safeRun(fn, ...args) {
  try {
    await fn(...args);
  } catch (err) {
    console.error("HANDLER ERROR:", err?.stack || err);

    const query = args.find(a => a?.id);
    if (query) {
      try {
        await bot.answerCallbackQuery(query.id, {
          text: "Ошибка. Попробуйте ещё раз.",
          show_alert: false
        });
      } catch (e) {}
    }
  }
}

console.log("Circus Nikulin bot starting...");

// ===== /start =====
bot.onText(/\/start/, msg => safeRun(handleStart, bot, msg));

// ===== CALLBACK ROUTER =====
bot.on("callback_query", async (query) => {
  const data = query.data;
  console.log("CALLBACK:", data);

  switch (true) {
    case data === 'about':
      return safeRun(handleAbout, bot, query);

    case data === 'news':
      return safeRun(handleNews, bot, query);

    case data === 'artists':
      return safeRun(handleArtists, bot, query);

    case data === 'schedule':
      return safeRun(handleSchedule, bot, query);

    case data === 'genres':
      return safeRun(handleGenres, bot, query);

    case data.startsWith('genre:'):
      return safeRun(handleGenreItem, bot, query);

    case data.startsWith('genre_mix:'):
      return safeRun(handleGenreMix, bot, query);

    case data === 'tickets':
      return safeRun(handleTickets, bot, query);

    case data === 'contacts':
      return safeRun(handleContacts, bot, query);

    case data === 'programs':
      return safeRun(handlePrograms, bot, query);

    case data === 'festival':
      return safeRun(handleFestival, bot, query);

    case data === 'back_to_menu':
      return safeRun(handleStart, bot, query);

    default:
      try {
        await bot.answerCallbackQuery(query.id, {
          text: "Команда не распознана",
          show_alert: false
        });
      } catch (e) {}
  }
});

// ===== IGNORE OTHER MESSAGES =====
bot.on("message", (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;
});

module.exports = bot;