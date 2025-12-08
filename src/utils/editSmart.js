// src/utils/editSmart.js

module.exports = async function editSmart(bot, input, text, extra = {}) {
  const opts = {
    parse_mode: 'Markdown',
    ...extra
  };

  if (extra.inline_keyboard && !opts.reply_markup) {
    opts.reply_markup = { inline_keyboard: extra.inline_keyboard };
  }

  // callback_query: редактируем существующее сообщение
  if (input?.message?.message_id) {
    const chatId = input.message.chat.id;
    const msgId = input.message.message_id;

    return bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      ...opts
    });
  }

  // обычное сообщение: отправляем новое
  if (input?.chat?.id) {
    return bot.sendMessage(input.chat.id, text, opts);
  }

  console.error('editSmart: неизвестный тип input', input);
};