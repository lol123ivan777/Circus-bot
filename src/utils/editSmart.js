// src/utils/editSmart.js
/**
 * editSmart(bot, input, text, keyboard)
 *
 * input - callback_query object OR message object OR chatId number
 * text - markdown text to show
 * keyboard - reply_markup object (already shaped for Telegram)
 *
 * Behavior:
 *  - if input is callback_query and message has caption -> editMessageCaption
 *  - if input is callback_query and message has text -> editMessageText
 *  - if input is plain message or chatId -> sendMessage/sendPhoto as appropriate handled by callers
 *  - on any failure -> sendMessage fallback
 */

async function editSmart(bot, input, text, keyboard, parseMode = 'Markdown') {
  // if numeric chatId passed
  if (typeof input === 'number') {
    return bot.sendMessage(input, text, { parse_mode: parseMode, reply_markup: keyboard });
  }

  const query = (input && input.data) ? input : null;
  const msg = query ? query.message : (input && input.message ? input.message : input);

  // get chatId/messageId where possible
  const chatId = msg?.chat?.id || input?.chat?.id || input?.from?.id;
  const msgId = msg?.message_id || null;

  if (!chatId) {
    throw new Error('editSmart: chatId not found');
  }

  try {
    if (msg && msg.caption !== undefined) {
      // message was media with caption
      return await bot.editMessageCaption(text, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: parseMode,
        reply_markup: keyboard
      });
    }

    if (msg && msg.text !== undefined) {
      // message is text
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: parseMode,
        reply_markup: keyboard
      });
    }

    // fallback — send new message
    return await bot.sendMessage(chatId, text, { parse_mode: parseMode, reply_markup: keyboard });
  } catch (err) {
    // On many Telegram errors (message not modified, old, etc.) we fallback to sendMessage
    console.warn('editSmart fallback (sendMessage):', err.message || err);
    return bot.sendMessage(chatId, text, { parse_mode: parseMode, reply_markup: keyboard });
  }
}

module.exports = { editSmart };