require('dotenv').config({ path: './.env' });
console.log("BOT TOKEN ===>", process.env.BOT_TOKEN);

const { mainMenuKeyboard } = require('./src/keyboards/mainMenu');
const { handleStart } = require('./src/handlers/start');
const { handleAbout } = require('./src/handlers/about');
const { handleSchedule } = require('./src/handlers/schedule');
const { handleTickets } = require('./src/handlers/tickets');
const { handleContacts } = require('./src/handlers/contacts');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// команда /start
bot.onText(/\/start/, (msg) => {
  handleStart(bot, msg);
});

// обычные сообщения
bot.on('message', (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (!text) return;

  if (text === '🎪 О цирке') return handleAbout(bot, chatId);
  if (text === '📰 Новости') return bot.sendMessage(chatId, 'Новости пока в разработке, читай на сайте circusnikulin.ru', mainMenuKeyboard);
  if (text === '🌟 Артисты') return bot.sendMessage(chatId, 'Раздел «Артисты» пока заглушка.', mainMenuKeyboard);
  if (text === '🎭 Программы') return handleSchedule(bot, chatId);
  if (text === '🎫 Билеты') return handleTickets(bot, chatId);
  if (text === '📍 Контакты') return handleContacts(bot, chatId);

  if (text === '⬅️ Назад в меню') {
    return bot.sendMessage(chatId, 'Главное меню цирка Никулина:', mainMenuKeyboard);
  }
});

console.log('Circus bot started');