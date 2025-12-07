// src/handlers/schedule.js
const { editSmart } = require('../utils/editSmart');

exports.handleSchedule = async (bot, input) => {
  const text =
    '*🎭 Расписание представлений*\n\n' +
    '• Пт — 19:00 — Вечерняя программа\n' +
    '• Сб — 12:00 — Семейная программа\n' +
    '• Вс — 18:00 — Шоу звезд\n\n' +
    'За покупкой билетов — на сайт или в кассу.';

  const reply_markup = { inline_keyboard: [[{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]] };
  return editSmart(bot, input, text, reply_markup);
};