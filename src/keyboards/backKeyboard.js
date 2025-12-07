// src/keyboards/backKeyboard.js
const backKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }
      ]
    ]
  }
};

module.exports = { backKeyboard };