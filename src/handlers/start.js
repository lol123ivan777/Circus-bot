// src/handlers/start.js

exports.handleStart = async (bot, input, msgId = null) => {
  console.log('START RAW INPUT:', JSON.stringify(input, null, 2));

  let chatId = null;

  // Если пришёл объект сообщения (msg)
  if (input && typeof input === 'object') {
    if (input.chat && input.chat.id) {
      chatId = input.chat.id;
    }

    // Если вызов через callback_query
    if (!chatId && input.message && input.message.chat) {
      chatId = input.message.chat.id;
    }
  }

  // Если пользователь передал просто число (chatId)
  if (!chatId && typeof input === 'number') {
    chatId = input;
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

  // Если старт вызван inline-кнопкой — редактируем старое сообщение
  if (msgId) {
    return bot.editMessageCaption(caption, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      reply_markup: mainMenuKeyboard.reply_markup
    });
  }

  // Иначе — обычный старт через /start
  return bot.sendPhoto(chatId, bannerUrl, {
    caption,
    parse_mode: 'Markdown',
    reply_markup: mainMenuKeyboard.reply_markup
  });
};