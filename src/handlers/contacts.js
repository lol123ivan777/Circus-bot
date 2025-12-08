exports.handleContacts = async (bot, input) => {
  const text =
"📞 *Контакты*\n\n" +
"Москва, Цветной бульвар, 13\n" +
"\\+7 495 628 83 49 (касса)\n" +
"\\+7 495 780 31 35 (администрация)\n\n" +
"VK: https://vk.com/circusnikulin\n" +
"TG: https://t.me/nikulin_circus";

  return go(bot, input, text, {
    parse_mode: "MarkdownV2",
    inline_keyboard: [
      [{ text: "🌐 Сайт", url: "https://circusnikulin.ru/" }],
      [{ text: "⬅️ Назад", callback_data: "back_to_menu" }]
    ]
  });
};