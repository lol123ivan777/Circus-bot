// src/handlers/start.js
exports.handleStart = async (bot, input, msgId = null) => {
  console.log('START RAW INPUT:', JSON.stringify(input && (input.data ? input : input), null, 2));

  let chatId = null;

  // callback_query
  if (input && input.data && input.message && input.message.chat) {
    chatId = input.message.chat.id;
  }

  // обычное msg
  if (!chatId && input && input.chat && input.chat.id) {
    chatId = input.chat.id;
  }

  // если просто цифрой передали
  if (!chatId && typeof input === 'number') {
    chatId = input;
  }

  if (!chatId) {
    console.error('START ERROR: chatId не найден');
    return;
  }

  const bannerUrl = 'https://i.imgur.com/4AiXzf8.jpeg';
  const caption =
    '🎪 *Добро пожаловать в цирк Никулина!* \n\n' +
    'Здесь вы можете узнать расписание представлений, ' +
    'ознакомиться с артистами, просмотреть новости ' +
    'и получить полезную информацию.\n\n' +
    'Выберите нужный раздел в меню ниже.';

  const { inlineMenuKeyboard } = require('../keyboards/inlineMenu');

  // Если старт вызван inline-кнопкой
  if (msgId) {
    try {
      return await bot.editMessageCaption(caption, {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: 'Markdown',
        reply_markup: inlineMenuKeyboard.reply_markup
      });
    } catch (err) {
      // 👉 ТУТ МЫ ЛОВИМ КЛАССИЧНУЮ ОШИБКУ "message is not modified"
      if (err.response && err.response.body && err.response.body.description &&
          err.response.body.description.includes('message is not modified')) {

        console.log('⚠️ Telegram: сообщение не изменилось, игнорируем.');
        return;
      }

      console.error('❌ ERROR editMessageCaption:', err);
      return;
    }
  }

  // Старт через текст или команду /start
  return bot.sendPhoto(chatId, bannerUrl, {
    caption,
    parse_mode: 'Markdown',
    reply_markup: inlineMenuKeyboard.reply_markup
  });
};