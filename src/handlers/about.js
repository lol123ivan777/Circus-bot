// src/handlers/about.js
exports.handleAbout = async (bot, input, msgId = null) => {
  // input может быть query или chatId или msg
  let chatId = null;
  if (input && input.data && input.message && input.message.chat) chatId = input.message.chat.id;
  if (!chatId && input && input.chat && input.chat.id) chatId = input.chat.id;
  if (!chatId && typeof input === 'number') chatId = input;

  if (!chatId) {
    console.error('ABOUT: chatId не найден');
    return;
  }

  const text =
    '🎪 *Цирк Никулина — история и традиции* 🎪\n\n' +
    '*📍 Адрес:* Москва, Цветной бульвар, дом 13\n' +
    '*📞 Телефон:* +7 (495) 628-8349\n\n' +
    '*🏛 Один из старейших цирков России.* Здание построено в 1880 году для цирка Альберта Саламонского. ' +
    '20 октября того же года прошёл первый спектакль. Цирк многократно реконструировался, но всегда оставался центром циркового искусства.\n\n' +
    '*🎭 Что мы предлагаем:* расписание, артистов, новости и бронирование билетов.\n\n' +
    'Выбирайте раздел в меню 👇';

  // формируем inline-клавиатуру с возвратом
  const reply_markup = {
    inline_keyboard: [
      [ { text: '⬅️ Назад в меню', callback_data: 'back_to_menu' } ]
    ]
  };

  // Если есть msgId (редактируем)
  if (msgId) {
    return bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      reply_markup
    });
  }

  return bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup
  });
};