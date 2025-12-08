const { inlineMenuKeyboard } = require('../keyboards/inlineMenu');

exports.handleStart = async (bot, input) => {
  const msg = input.message || input;
  const chatId = msg.chat.id;

  return bot.sendPhoto(chatId, "https://i.imgur.com/4AiXzf8.jpeg", {
    caption:
    "🎪 *Цирк Никулина*\n\n" +
    "Добро пожаловать! Выберите раздел ниже.",
    parse_mode: "Markdown",
    reply_markup: inlineMenuKeyboard.reply_markup
  });
};