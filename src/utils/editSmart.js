// utils/editSmart.js

async function editSmart(bot, input, text, keyboard = null) {
  try {
    const chatId = input.message?.chat?.id || input.chat?.id;
    const messageId = input.message?.message_id;

    const options = {
      parse_mode: "Markdown",
    };

    if (keyboard) {
      options.reply_markup = keyboard;
    }

    // если есть message_id — редактируем
    if (messageId) {
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        ...options
      });
    }

    // если нет — отправляем новое сообщение
    return await bot.sendMessage(chatId, text, options);
  } catch (err) {
    console.error("editSmart ERROR:", err);

    try {
      // попытка fallback отправить новое сообщение, чтобы кнопки не пропали
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

module.exports = { editSmart };async function editSmart(bot, input, text, keyboard) {
  const chatId = input.message?.chat?.id || input.chat?.id;
  const messageId = input.message?.message_id;

  if (messageId) {
    return bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  return bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

module.exports = { editSmart };