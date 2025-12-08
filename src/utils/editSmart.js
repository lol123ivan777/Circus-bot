// src/utils/editSmart.js

module.exports = async function editSmart(bot, input, text, extra = {}) {
  const chatId =
    input.message?.chat?.id ||
    input.chat?.id;

  const messageId = input.message?.message_id;

  const opts = {
    parse_mode: extra.parse_mode ?? "Markdown",
    reply_markup: extra.inline_keyboard
      ? { inline_keyboard: extra.inline_keyboard }
      : undefined
  };

  try {
    // Можно редактировать ТОЛЬКО текстовые сообщения
    const isText =
      input.message &&
      typeof input.message.text === "string";

    if (messageId && isText) {
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        ...opts
      });
    }

    // если нельзя редактировать — создаём новое
    return await bot.sendMessage(chatId, text, opts);

  } catch (err) {
    console.error("editSmart ERROR:", err);

    // fallback — просто отправляем новое
    return bot.sendMessage(chatId, text, opts);
  }
};