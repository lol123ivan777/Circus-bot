// src/handlers/start.js
const { inlineMenuKeyboard } = require('../keyboards/inlineMenu');

exports.handleStart = async (bot, input) => {
  const msg = input.message || input;
  const chatId = msg.chat.id;

  const bannerUrl = 'https://i.imgur.com/4AiXzf8.jpeg';

  const caption =
    '🎪 *Добро пожаловать в цирк Никулина!* \n\n' +
    'Добро пожаловать в официальный Telegram-бот цирка Никулина. ' +
    'Выберите раздел ниже, чтобы продолжить.';

  return bot.sendPhoto(chatId, bannerUrl, {
    caption,
    parse_mode: 'Markdown',
    reply_markup: inlineMenuKeyboard.reply_markup
  });
};