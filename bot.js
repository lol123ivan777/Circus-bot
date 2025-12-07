require('dotenv').config({ path: __dirname + '/.env' });
console.log('BOT TOKEN ===>', process.env.BOT_TOKEN);

const TelegramBot = require('node-telegram-bot-api');

const { mainMenuKeyboard } = require('./src/keyboards/mainMenu');
const { handleStart } = require('./src/handlers/start');
const { handleAbout } = require('./src/handlers/about');
const { handleSchedule } = require('./src/handlers/schedule');
const { handleTickets } = require('./src/handlers/tickets');
const { handleContacts } = require('./src/handlers/contacts');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true
  }
});

// лог ошибок polling
bot.on('polling_error', (err) => {
  console.error('POLLING ERROR:', err.message || err);
});

// команда /start
bot.onText(//start/, (msg) => {
  console.log('ON /start', msg.chat.id);
  handleStart(bot, msg);
});

// общий лог для ВСЕХ сообщений
bot.on('message', (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  console.log('NEW MESSAGE ===>', text);

  // тестовый автоответ, чтобы бот хоть что‑то прислал
  if (text) {
    bot.sendMessage(chatId, 'Я живой, сообщение получил ✅');
  }

  if (!text) return;

  if (text === '🎪 О цирке') return handleAbout(bot, chatId);
  if (text === '📰 Новости') {
    return bot.sendMessage(
      chatId,
      'Новости пока в разработке, читай на сайте circusnikulin.ru',
      mainMenuKeyboard
    );
  }
  if (text === '🌟 Артисты') {
    return bot.sendMessage(
      chatId,
      'Раздел «Артисты» пока заглушка.',
      mainMenuKeyboard
    );
  }
  if (text === '🎭 Программы') return handleSchedule(bot, chatId);
  if (text === '🎫 Билеты') return handleTickets(bot, chatId);
  if (text === '📍 Контакты') return handleContacts(bot, chatId);

  if (text === '⬅️ Назад в меню') {
    return bot.sendMessage(
      chatId,
      'Главное меню цирка Никулина:',
      mainMenuKeyboard
    );
  }
});

console.log('Circus bot started');