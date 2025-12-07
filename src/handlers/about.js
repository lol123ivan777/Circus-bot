// src/handlers/about.js
const { editSmart } = require('../utils/editSmart');
const { backKeyboard } = require('../keyboards/backKeyboard');

exports.handleAbout = async (bot, input) => {
  const text =
    '🎪 *Цирк Никулина — история и традиции* 🎪\n\n' +
    '*📍 Адрес:* Москва, Цветной бульвар, дом 13\n' +
    '*📞 Телефон:* +7 (495) 628-8349\n\n' +
    'Цирк Никулина — одно из старейших и самых известных цирковых мест России.';

  // editSmart will choose caption/text/sendMessage depending on current message
  return editSmart(bot, input, text, backKeyboard.reply_markup);
};