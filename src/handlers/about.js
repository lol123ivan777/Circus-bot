// src/handlers/about.js

const { mainMenuKeyboard } = require('../keyboards/mainMenu');

module.exports.handleAbout = async (bot, input, msgId) => {
  const chatId = input.message
    ? input.message.chat.id          // вызов через кнопку
    : input.chat
      ? input.chat.id               // вызов через команду
      : input.from.id;              // fallback

  const text = `🎪 *О цирке Никулина*\n
Цирк Никулина на Цветном бульваре — один из самых известных и старейших цирков страны.
Здесь проходят шоу мирового уровня, работают лучшие артисты, а сама атмосфера пропитана историей и магией.`.trim();

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '⬅️ Назад', callback_data: 'back_to_menu' }],
      ]
    },
    parse_mode: 'Markdown'
  };

  // Если это callback — редактируем сообщение
  if (input.message && msgId) {
    return bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      ...keyboard
    });
  }

  // Если это команда /about или вызов через /start
  return bot.sendMessage(chatId, text, keyboard);
};