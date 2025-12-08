// src/utils/editSmart.js

async function editSmart(bot, input, text, extra = {}) {
  // extra: { inline_keyboard?: [...] }

  const chatId =
    input?.message?.chat?.id ??
    input?.chat?.id;

  const messageId = input?.message?.message_id;

  if (!chatId) {
    console.error('editSmart: не смог получить chatId', input);
    return;
  }

  const opts = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: extra.inline_keyboard || []
    }
  };

  try {
    // Если это callback_query с message_id → редактируем
    if (messageId) {
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        ...opts
      });
    }

    // Иначе отправляем новое сообщение
    return await bot.sendMessage(chatId, text, opts);

  } catch (err) {
    console.error('editSmart ERROR:', err);

    // Фоллбек: пробуем хотя бы отправить новое сообщение
    try {
      return await bot.sendMessage(chatId, text, opts);
    } catch (inner) {
      console.error('editSmart FALLBACK ERROR:', inner);
    }
  }
}

module.exports = editSmart;