// src/utils/editSmart.js

/**
 * Универсальная функция.
 * Автоматически определяет, нужно редактировать текст или caption,
 * или же Telegram не даёт редактировать и нужно отправить новое сообщение.
 */

async function editSmart(bot, query, text, keyboard) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  const hasCaption = !!query.message.caption;
  const hasText = !!query.message.text;

  try {
    if (hasCaption) {
      // Сообщение изначально было с фото
      return await bot.editMessageCaption(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    }

    if (hasText) {
      // Сообщение — текстовое
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    }

    // Если у сообщения нет ни текста, ни caption — странно, но бывает
    return await bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });

  } catch (err) {
    // Telegram может не дать редактировать (старое сообщение, изменённое фото, баги)
    console.log("editSmart fallback → sendMessage:", err.message);

    return bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }
}

module.exports = { editSmart };