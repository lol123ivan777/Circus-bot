const { go } = require('../utils/navigation');

exports.handleAbout = async (bot, input) => {
  return go(bot, input,
    "🎪 *О цирке*\n\n" +
    "Цирк Никулина — легендарный цирк России .\n" +
    "Традиции, история и уникальные номера.",
    {
      inline_keyboard: [
        [{ text: "⬅️ Назад", callback_data: "back_to_menu" }]
      ]
    }
  );
};