// Универсальный безопасный ответ: если это callback — редактируем сообщение,
// если это обычный message — отправляем новое

module.exports = async function editSmart(bot, input, text, extra = {}) {
  const opts = { parse_mode: "Markdown", ...extra };

  // callback_query
  if (input?.message?.message_id) {
    const chatId = input.message.chat.id;
    const msgId = input.message.message_id;

    return bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      ...opts,
      reply_markup: { inline_keyboard: extra.inline_keyboard || [] }
    });
  }

  // обычное сообщение
  if (input?.chat?.id) {
    return bot.sendMessage(input.chat.id, text, {
      ...opts,
      reply_markup: { inline_keyboard: extra.inline_keyboard || [] }
    });
  }

  console.error("editSmart: неизвестный тип input", input);
};