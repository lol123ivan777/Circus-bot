const editSmart = require('../utils/editSmart');

exports.handleArtists = async (bot, input) => {
  const text =
"✨ *Артисты цирка*\n\n" +
"Артисты Цирка Никулина на Цветном бульваре .";

  return editSmart(bot, input, text, {
    inline_keyboard: [
      [{ text: "Загрузить ещё", callback_data: "artists_more" }],
      [{ text: "⬅️ Назад", callback_data: "back_to_menu" }]
    ]
  });
};