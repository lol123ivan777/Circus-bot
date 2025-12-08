// src/handlers/artists.js
const editSmart = require('../utils/editSmart');

exports.handleArtists = async (bot, input) => {
  const text =
    '✨ *Артисты цирка*\n\n' +
    'Артисты Цирка Никулина на Цветном бульваре — ведущие мастера циркового искусства.\n' +
    'В репертуаре — акробаты, воздушные гимнасты, клоуны, жонглёры и многие другие.';

  return editSmart(bot, input, text, {
    inline_keyboard: [
      [{ text: 'Загрузить ещё', callback_data: 'artists_more' }],
      [{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]
    ]
  });
};