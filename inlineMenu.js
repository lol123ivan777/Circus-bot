// src/keyboards/inlineMenu.js

const inlineMenuKeyboard = {
  reply_markup: {
    inline_keyboard: [
      // ... твои остальные кнопки
      [
        {
          text: '📶 Web-приложение',
          web_app: { url: 'https://circus-app-eight.vercel.app/' }
        }
      ]
    ]
  }
};

module.exports = { inlineMenuKeyboard };
