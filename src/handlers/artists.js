exports.handleArtists = async (bot, input) => {
  const text =
    "✨ *Артисты цирка*\n\n" +
    "Выберите категорию или листайте вниз.";

  return go(bot, input, text, {
    inline_keyboard: [
      [{ text: "Загрузить ещё", callback_data: "artists_more" }],
      [{ text: "⬅️ Назад", callback_data: "back_to_menu" }]
    ]
  });
};