// src/handlers/start.js
const { inlineMenuKeyboard } = require('../keyboards/inlineMenu');
const editSmart = require('../utils/editSmart');

exports.handleStart = async (bot, input) => {
  const isCallback = !!input.data;
  const msg = input.message || input;
  const chatId = msg.chat.id;

  const text =
    '🎪 *Цирк Никулина*\n\n' +
    'Выберите раздел ниже.';

  // Если вызов /start → создаём новое сообщение
  // Если callback → редактируем существующее
  const targetInput = isCallback ? input : { chat: { id: chatId } };

  return editSmart(bot, targetInput, text, {
    inline_keyboard: inlineMenuKeyboard.reply_markup.inline_keyboard
  });
};