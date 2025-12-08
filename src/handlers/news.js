const editSmart = require('../utils/editSmart');

exports.handleNews = async (bot, input) => {
  const text =
"📰 *Новости цирка*\n\n" +
"Последние события.";

  return editSmart(bot, input, text, {
    inline_keyboard: [
      [{ text: "Загрузить ещё", callback_data: "news_more" }],
      [{ text: "⬅️ Назад", callback_data: "back_to_menu" }]
    ]
  });
};