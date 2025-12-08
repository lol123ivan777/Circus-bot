async function editSmart(bot, input, text, keyboard = null) {
  try {
    const chatId = input.message?.chat?.id || input.chat?.id;
    const messageId = input.message?.message_id;

    const options = { parse_mode: "Markdown" };
    if (keyboard) options.reply_markup = keyboard;

    if (messageId) {
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        ...options
      });
    }

    return await bot.sendMessage(chatId, text, options);

  } catch (err) {
    console.error("editSmart ERROR:", err);
    try {
      const chatId = input.message?.chat?.id || input.chat?.id;
      return await bot.sendMessage(chatId, text, {
        parse_mode: "Markdown",
        reply_markup: keyboard || undefined
      });
    } catch (inner) {
      console.error("editSmart FALLBACK ERROR:", inner);
    }
  }
}

module.exports = editSmart;