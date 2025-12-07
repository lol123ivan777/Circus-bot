// src/handlers/start.js

exports.handleStart = async (bot, msg, msgId) => {
  console.log('START RAW MSG:', JSON.stringify(msg, null, 2));

  let chatId;

  // /start
  if (msg.chat) {
    chatId = msg.chat.id;
  }

  // inline callback
  if (!chatId && msg.message && msg.message.chat) {
    chatId = msg.message.chat.id;
  }

  if (!chatId) {
    console.error('START ERROR: chatId не найден');
    return;
  }

  const bannerUrl = 'https://i.imgur.com/4AiXzf8.jpeg';

  const caption =
    '🎪 *Добро пожаловать в цирк Никулина!* \n\n' +
    'Здесь вы можете узнать расписание представлений, ' +
    'ознакомиться с артистами, просмотреть новости ' +
    'и получить полезную информацию.\n\n' +
    'Выберите нужный раздел в меню ниже.';

  const { mainMenuKeyboard } = require('../keyboards/mainMenu');

  // Если это inline-редактирование
  if (msgId) {
    return bot.editMessageCaption(
      caption,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: 'Markdown',
        reply_markup: mainMenuKeyboard.reply_markup
      }
    );
  }

  // /start — отправляем фото + меню
  return bot.sendPhoto(chatId, bannerUrl, {
    caption,
    parse_mode: 'Markdown',
    reply_markup: mainMenuKeyboard.reply_markup
  });
};