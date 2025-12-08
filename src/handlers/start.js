// src/handlers/start.js
const { inlineMenuKeyboard } = require('../keyboards/inlineMenu');
const editSmart = require('../utils/editSmart');

const START_PHOTO_URL = 'https://i.imgur.com/4AiXzf8.jpeg';

exports.handleStart = async (bot, input) => {
  const isCallback = !!input.data;
  const msg = input.message || input;
  const chatId = msg.chat.id;

  // если это /start (обычное сообщение) — показываем фото один раз
  if (!isCallback) {
    await bot.sendPhoto(chatId, START_PHOTO_URL, {
      caption:
        '🎪 *Цирк Никулина*\n\n' +
        'Добро пожаловать в легендарный цирк на Цветном бульваре.',
      parse_mode: 'Markdown'
    });
  }

  const text =
    '🎪 *Цирк Никулина*\n\n' +
    'Выберите раздел ниже.';

  // для callback редактируем сообщение с кнопками
  // для /start создаём новое сообщение с меню
  const targetInput = isCallback ? input : { chat: { id: chatId } };

  return editSmart(bot, targetInput, text, {
    inline_keyboard: inlineMenuKeyboard.reply_markup.inline_keyboard
  });
};