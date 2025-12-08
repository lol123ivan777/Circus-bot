const editSmart = require('../utils/editSmart');

exports.handleGenres = async (bot, input) => {
  return editSmart(bot, input,
"🎭 *Жанры циркового искусства*\n\n" +
"Выберите интересующий жанр.",
  {
    inline_keyboard: [
      [{ text: "🎪 Жонглирование", callback_data: "genre:juggling" }],
      [{ text: "🤡 Клоунада", callback_data: "genre:clown" }],
      [{ text: "🤸 Воздушные гимнасты", callback_data: "genre:aerial" }],
      [{ text: "⬅️ Назад", callback_data: "back_to_menu" }]
    ]
  });
};