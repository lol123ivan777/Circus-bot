async function editSmart(bot, input, text, keyboard) {
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