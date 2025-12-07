// src/handlers/contacts.js
const { editSmart } = require('../utils/editSmart');

exports.handleContacts = async (bot, input) => {
  const text =
    '📞 *Контакты цирка Никулина*\n\n' +
    '*Адрес:*\n' +
    '127051, Москва, Цветной бульвар 13\n\n' +
    '*Телефон кассы:* +7 (495) 628-83-49\n' +
    '*Администрация:* +7 (495) 780-31-35\n\n' +
    '*E-mail:*\n' +
    '• Общая информация: info@circusnikulin.ru\n' +
    '• Для СМИ: pr@circusnikulin.ru\n\n' +
    '*Соцсети:*\n' +
    '• VK: vk.com/circusnikulin\n' +
    '• Telegram: t.me/nikulin_circus';

  const inline_keyboard = [
    [
      {
        text: '🌐 Открыть сайт',
        url: 'https://circusnikulin.ru/'
      }
    ],
    [
      {
        text: '📍 Открыть в картах (Яндекс)',
        url: 'https://yandex.ru/maps/-/CCUuFCoxcB' // можно заменить на свою ссылку
      }
    ],
    [
      { text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }
    ]
  ];

  return editSmart(bot, input, text, { inline_keyboard });
};