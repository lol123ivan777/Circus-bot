require('dotenv').config({ path: __dirname + '/.env' });
console.log('BOT TOKEN =>', process.env.BOT_TOKEN);

const TelegramBot = require('node-telegram-bot-api');

const { handleAbout } = require('./src/handlers/about');
const { handleNews, handleNewsCallback } = require('./src/handlers/news');
const { handleArtists } = require('./src/handlers/artists');
const { handleSchedule } = require('./src/handlers/schedule');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true
  }
});

// главное меню inline
const inlineMainMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '🎪 О цирке', callback_data: 'about' }],
      [{ text: '📰 Новости', callback_data: 'news' }],
      [{ text: '🌟 Артисты', callback_data: 'artists' }],
      [{ text: '🎭 Расписание', callback_data: 'schedule' }]
    ]
  }
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Добро пожаловать в цирк Никулина! 🎪\n\nВыберите раздел:',
    inlineMainMenu
  );
});

// обработка кнопок
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;

  // Главные разделы
  if (data === 'about') return handleAbout(bot, chatId, msgId);
  if (data === 'artists') return handleArtists(bot, chatId, msgId);
  if (data === 'schedule') return handleSchedule(bot, chatId, msgId);

  // Новости (начальный экран)
  if (data === 'news') return handleNews(bot, chatId, msgId);

  // Пагинация новостей
  if (data.startsWith('news_page_')) return handleNewsCallback(bot, query);

  // Назад
  if (data === 'back_to_menu') {
    return bot.editMessageText(
      'Главное меню цирка Никулина:',
      { chat_id: chatId, message_id: msgId, reply_markup: inlineMainMenu.reply_markup }
    );
  }
});

console.log('Circus bot started');