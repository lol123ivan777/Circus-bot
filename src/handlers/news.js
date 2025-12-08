// src/handlers/news.js
const editSmart = require('../utils/editSmart');

exports.handleNews = async (bot, input) => {
  const text =
    '📰 *Новости цирка*\n\n' +
    'Последние события, новые программы и анонсы — на официальном сайте и в соцсетях цирка.';

  return editSmart(bot, input, text, {
    inline_keyboard: [
      [
        {
          text: '🌐 Раздел новостей на сайте',
          url: 'https://circusnikulin.ru/news'
        }
      ],
      [{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]
    ]
  });
};