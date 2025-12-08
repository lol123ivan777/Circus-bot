// src/handlers/festival.js
const editSmart = require('../utils/editSmart');

exports.handleFestival = async (bot, input) => {
  const text =
    '🌟 *Фестивали в цирке Никулина*\n\n' +
    'В разные годы в цирке проходили цирковые фестивали и специальные проекты.\n' +
    'Фото и видео этих событий удобнее всего смотреть в официальном Telegram-канале и на сайте.\n\n' +
    'Выберите, где хотите посмотреть материалы.';

  const inline_keyboard = [
    [
      {
        text: '📸 Фото и видео (TG-канал)',
        url: 'https://t.me/nikulin_circus'
      }
    ],
    [
      {
        text: '🌐 Раздел на сайте',
        url: 'https://circusnikulin.ru/festival'
      }
    ],
    [
      { text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }
    ]
  ];

  return editSmart(bot, input, text, { inline_keyboard });
};