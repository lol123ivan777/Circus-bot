// src/handlers/contacts.js
const { editSmart } = require('../utils/editSmart');

exports.handleContacts = async (bot, input) => {
  const text =
"📞 Контакты цирка Никулина\n\n" +
"Адрес:\n" +
"Москва, Цветной бульвар, 13\n\n" +
"Телефон кассы:\n" +
"+7 495 628 83 49\n\n" +
"Администрация:\n" +
"+7 495 780 31 35\n\n" +
"E-mail:\n" +
"info@circusnikulin.ru\n" +
"pr@circusnikulin.ru\n\n" +
"Соцсети:\n" +
"VK: https://vk.com/circusnikulin\n" +
"Telegram: https://t.me/nikulin_circus\n";

  const inline_keyboard = [
    [{ text: "🌐 Открыть сайт", url: "https://circusnikulin.ru/" }],
    [{ text: "📍 Яндекс.Карты", url: "https://yandex.ru/maps/-/CCUuFCoxcB" }],
    [{ text: "⬅️ Назад", callback_data: "back_to_menu" }]
  ];

  // ВАЖНО: parse_mode отключён
  return editSmart(bot, input, text, { inline_keyboard }, null);
};