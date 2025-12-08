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
const { handleArtists, handleArtistsPage } = require('./src/handlers/artists');
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

    const query = args.find(a => a && a.id && a.data && a.message);
    if (query) {
      try {
        await bot.answerCallbackQuery(query.id, {
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


// ======================
// Центральный роутер
// ======================
bot.on('callback_query', async (query) => {
  const data = query?.data;
  console.log("CALLBACK:", data);

  if (data === "about") return safeRun(handleAbout, bot, query);
  if (data === "news") return safeRun(handleNews, bot, query);

  if (data === "artists") return safeRun(handleArtists, bot, query);
  if (data.startsWith("artists_page_")) return safeRun(handleArtistsPage, bot, query);

  if (data === "schedule") return safeRun(handleSchedule, bot, query);
if (data.startsWith("schedule_month:")) return safeRun(handleSchedule, bot, query);

  if (data === "genres") return safeRun(handleGenres, bot, query);
  if (data.startsWith("genre:")) return safeRun(handleGenreItem, bot, query);

  if (data === "tickets") return safeRun(handleTickets, bot, query);
  if (data === "contacts") return safeRun(handleContacts, bot, query);

  if (data === "programs") return safeRun(handlePrograms, bot, query);
  if (data === "festival") return safeRun(handleFestival, bot, query);

  if (data === "back_to_menu") return safeRun(handleStart, bot, query);

  try {
    await bot.answerCallbackQuery(query.id, {
      text: "Команда не распознана",
      show_alert: false
    });
  } catch (e) {}
});


// игнор обычных сообщений
bot.on("message", msg => {
  if (!msg.text || msg.text.startsWith("/")) return;
});

module.exports = bot;