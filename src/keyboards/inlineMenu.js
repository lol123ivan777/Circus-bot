// src/keyboards/inlineMenu.js

const inlineMenuKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🎪 О цирке', callback_data: 'about' },
        { text: '📰 Новости', callback_data: 'news' }
      ],
      [
        { text: '✨ Артисты', callback_data: 'artists' },
        { text: '📅 Расписание', callback_data: 'schedule' }
      ],
      [
        { text: '🐅 Жанры', callback_data: 'genres' },
        { text: '🎟 Билеты', callback_data: 'tickets' }
      ],
      [
        { text: '☎️ Контакты', callback_data: 'contacts' }
      ]
    ]
  }
};

module.exports = { inlineMenuKeyboard };