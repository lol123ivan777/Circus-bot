// src/handlers/about.js
const { go } = require('../utils/navigation');

exports.handleAbout = async (bot, input) => {
  const text =
    '🎪 *О цирке*\n\n' +
    'Цирк Никулина на Цветном бульваре — один из самых известных цирков России.\n' +
    'Традиции, история и уникальные номера для всей семьи.';

  return go(bot, input, text, {
    inline_keyboard: [
      [{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]
    ]
  });
};