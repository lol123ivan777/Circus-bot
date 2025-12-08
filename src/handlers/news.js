exports.handleNews = async (bot, input) => {
  const text =
    "📰 *Новости*\n\n" +
    "Последние события цирка.";

  return go(bot, input, text, {
    inline_keyboard: [
      [{ text: "Загрузить ещё", callback_data: "news_more" }],
      [{ text: "⬅️ Назад", callback_data: "back_to_menu" }]
    ]
  });
};