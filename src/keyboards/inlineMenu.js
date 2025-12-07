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
        { text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }
      ]
    ]
  }
};

module.exports = { inlineMenuKeyboard };