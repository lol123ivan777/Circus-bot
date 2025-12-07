exports.handleStart = async (bot, input, msgId = null) => {
  console.log('START RAW INPUT:', JSON.stringify(input, null, 2));

  let chatId = null;
  let message = null;

  if (input?.message?.chat) {
    chatId = input.message.chat.id;
    message = input.message;
  }

  if (input?.chat?.id) {
    chatId = input.chat.id;
  }

  if (typeof input === 'number') {
    chatId = input;
  }

  if (!chatId) return console.error('START ERROR: chatId не найден');

  const bannerUrl = 'https://i.imgur.com/4AiXzf8.jpeg';
  const caption =
    '🎪 *Добро пожаловать в цирк Никулина!* \n\n' +
    'Здесь вы можете узнать расписание, новости, артистов и расписание.\n\n' +
    'Выберите нужный раздел ниже.';

  const { inlineMenuKeyboard } = require('../keyboards/inlineMenu');

  // ЕСЛИ НУЖНО ОТРЕДАКТИРОВАТЬ СУЩЕСТВУЮЩЕЕ СООБЩЕНИЕ
  if (msgId) {
    if (message && message.photo) {
      // сообщение было фото → редактируем caption
      return bot.editMessageCaption(caption, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: 'Markdown',
        reply_markup: inlineMenuKeyboard.reply_markup
      });
    } else {
      // сообщение было текст → редактируем текст
      return bot.editMessageText(caption, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: 'Markdown',
        reply_markup: inlineMenuKeyboard.reply_markup
      });
    }
  }

  // обычный старт через /start
  return bot.sendPhoto(chatId, bannerUrl, {
    caption,
    parse_mode: 'Markdown',
    reply_markup: inlineMenuKeyboard.reply_markup
  });
};