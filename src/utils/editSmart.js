// src/utils/editSmart.js

module.exports = async function editSmart(bot, input, text, extra = {}) {
  const chatId =
    input.message?.chat?.id ||
    input.chat?.id;

  const messageId = input.message?.message_id;

  const opts = {};

  // ---- parse_mode логика ----
  if ('parse_mode' in extra) {
    // если явно передали parse_mode
    if (extra.parse_mode != null) {
      opts.parse_mode = extra.parse_mode;   // 'Markdown', 'HTML', и т.п.
    }
    // если parse_mode: undefined/null — просто НЕ ставим его
  } else {
    // по умолчанию Markdown, если ничего не указали
    opts.parse_mode = 'Markdown';
  }

  // клавиатура
  if (extra.inline_keyboard) {
    opts.reply_markup = { inline_keyboard: extra.inline_keyboard };
  }

  try {
    const isText =
      input.message &&
      typeof input.message.text === 'string';

    // редактируем только текстовые сообщения
    if (messageId && isText) {
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        ...opts
      });
    }

    // иначе отправляем новое
    return await bot.sendMessage(chatId, text, opts);

  } catch (err) {
    console.error('editSmart ERROR:', err);
    // fallback — новое сообщение
    try {
      return await bot.sendMessage(chatId, text, opts);
    } catch (inner) {
      console.error('editSmart FALLBACK ERROR:', inner);
    }
  }
};