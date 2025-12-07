// src/keyboards/inlineMenu.js
const inlineMenuKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🎪 О цирке', callback_data: 'about' },
        { text: '📰 Новости', callback_data: 'news' }
      ],
      [
        { text: '🎭 Программы', callback_data: 'programs' },
        { text: '✨ Артисты', callback_data: 'artists' }
      ],
      [
        { text: '📅 Расписание', callback_data: 'schedule' },
        { text: '🎟 Билеты', callback_data: 'tickets' }
      ],
      [
        { text: '📞 Контакты', callback_data: 'contacts' },
        { text: '🌟 Фестиваль', callback_data: 'festival' }
      ]
    ]
  }
};

module.exports = { inlineMenuKeyboard };