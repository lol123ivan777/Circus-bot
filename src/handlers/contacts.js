// src/handlers/contacts.js
const { editSmart } = require('../utils/editSmart');

exports.handleContacts = async (bot, input) => {
  const text = 
`📞 Контакты цирка Никулина

Адрес:
Москва, Цветной бульвар, 13

Телефон кассы:
+7 495 628 83 49

Администрация:
+7 495 780 31 35

E-mail:
info@circusnikulin.ru
pr@circusnikulin.ru

Соцсети:
VK: https://vk.com/circusnikulin
Telegram: https://t.me/nikulin_circus
`;

  const inline_keyboard = [
    [{ text: '🌐 Открыть сайт', url: 'https://circusnikulin.ru/' }],
    [{ text: '📍 Яндекс.Карты', url: 'https://yandex.ru/maps/-/CCUuFCoxcB' }],
    [{ text: '⬅️ Назад', callback_data: 'back_to_menu' }]
  ];

  return editSmart(bot, input, text, { inline_keyboard });
};