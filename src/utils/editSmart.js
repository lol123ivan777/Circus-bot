// src/utils/editSmart.js

async function editSmart(bot, query, text, keyboard) {
  const msg = query.message;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  try {
    // Если сообщение — фото с caption
    if (msg.caption !== undefined) {
      return await bot.editMessageCaption(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    }

    // Если текстовое сообщение
    if (msg.text !== undefined) {
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    }

    // На всякий случай fallback
    return await bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });

  } catch (err) {
    console.log("editSmart ERROR, fallback → sendMessage:");
    console.log(err.message);

    return bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }
}

module.exports = { editSmart };