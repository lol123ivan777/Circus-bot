// src/handlers/start.js

exports.handleStart = async (bot, msg) => {
  const chatId = msg.chat.id;

  const bannerUrl = 'https://i.imgur.com/4AiXzf8.jpeg';

  const caption =
    '🎪 *Добро пожаловать в цирк Никулина!* \n\n' +
    'Здесь вы можете узнать расписание представлений, ' +
    'ознакомиться с артистами, просмотреть новости ' +
    'и получить полезную информацию.\n\n' +
    'Выберите нужный раздел в меню ниже.';

  const { mainMenuKeyboard } = require('../keyboards/mainMenu');

  await bot.sendPhoto(chatId, bannerUrl, {
    caption,
    parse_mode: 'Markdown',
    reply_markup: mainMenuKeyboard.reply_markup
  });
};