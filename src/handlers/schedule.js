// src/handlers/schedule.js
exports.handleSchedule = async (bot, input, msgId = null) => {
  // простая демонстрация — данные можно парсить с сайта или держать локально
  let chatId = null;
  if (input && input.data && input.message) chatId = input.message.chat.id;
  if (!chatId && input && input.chat && input.chat.id) chatId = input.chat.id;
  if (!chatId && typeof input === 'number') chatId = input;
  if (!chatId) {
    console.error('SCHEDULE: chatId не найден');
    return;
  }

  const text =
    '*🎭 Расписание представлений*\n\n' +
    '• 12 декабря — 18:00 — Семейная программа\n' +
    '• 13 декабря — 19:00 — Вечерний спектакль\n\n' +
    'Для покупки билетов — официальный сайт или касса.\n';

  const reply_markup = {
    inline_keyboard: [
      [ { text: '⬅️ Назад', callback_data: 'back_to_menu' } ]
    ]
  };

  if (msgId) {
    return bot.editMessageText(text, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup });
  }
  return bot.sendMessage(chatId, text, { parse_mode: 'Markdown', reply_markup });
};