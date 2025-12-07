// src/handlers/start.js
const { inlineMenuKeyboard } = require('../keyboards/inlineMenu');

exports.handleStart = async (bot, input, msgId = null) => {
  // input may be callback_query or message object
  const query = input && input.data ? input : null;
  const msg = query ? query.message : input;
  const chatId = msg?.chat?.id || input?.chat?.id || input?.from?.id;

  if (!chatId) {
    console.error('START: chatId not found');
    return;
  }

  const bannerUrl = 'https://i.imgur.com/4AiXzf8.jpeg';
  const caption =
    '🎪 *Добро пожаловать в цирк Никулина!* \n\n' +
    'Здесь вы можете узнать расписание представлений, ' +
    'ознакомиться с артистами и посмотреть новости.\n\n' +
    'Выберите раздел в меню ниже.';

  // If msgId present - try to edit existing (smart logic handled in editSmart for content types)
  if (msgId) {
    try {
      // if original message was photo -> edit caption; if text -> edit text
      const originalMsg = query ? query.message : null;
      if (originalMsg && originalMsg.photo) {
        return bot.editMessageCaption(caption, {
          chat_id: chatId,
          message_id: msgId,
          parse_mode: 'Markdown',
          reply_markup: inlineMenuKeyboard.reply_markup
        }).catch(err => {
          // ignore "message is not modified"
          if (err?.response?.body?.description && err.response.body.description.includes('message is not modified')) {
            return;
          }
          throw err;
        });
      } else {
        return bot.editMessageText(caption, {
          chat_id: chatId,
          message_id: msgId,
          parse_mode: 'Markdown',
          reply_markup: inlineMenuKeyboard.reply_markup
        }).catch(err => {
          if (err?.response?.body?.description && err.response.body.description.includes('message is not modified')) {
            return;
          }
          throw err;
        });
      }
    } catch (e) {
      // fallback send new
      return bot.sendPhoto(chatId, bannerUrl, {
        caption,
        parse_mode: 'Markdown',
        reply_markup: inlineMenuKeyboard.reply_markup
      });
    }
  }

  // normal start: send banner photo with inline menu
  return bot.sendPhoto(chatId, bannerUrl, {
    caption,
    parse_mode: 'Markdown',
    reply_markup: inlineMenuKeyboard.reply_markup
  });
};