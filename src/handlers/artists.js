// src/handlers/artists.js
const fs = require('fs');
const path = require('path');

const PAGE_SIZE = 5;

function loadLocalArtists() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '..', 'data', 'artists.json'), 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('ARTISTS: cannot load artists.json', e);
    return [];
  }
}

function buildArtistsText(slice, page) {
  let text = `✨ *Артисты — страница ${page+1}* \n\n`;
  slice.forEach((a, i) => {
    text += `*${page*PAGE_SIZE + i + 1}.* ${a.name} — _${a.role}_\n`;
    if (a.bio) text += `${a.bio.slice(0, 200)}...\n`;
    text += `\n`;
  });
  return text;
}

exports.handleArtists = async (bot, input, msgId = null) => {
  let chatId = null;
  let requestedPage = 0;

  if (input && input.data && input.message) {
    chatId = input.message.chat.id;
    if (input.data && input.data.startsWith('artists_page:')) {
      requestedPage = parseInt(input.data.split(':')[1], 10) || 0;
    }
  }

  if (!chatId && input && input.chat && input.chat.id) chatId = input.chat.id;
  if (!chatId && typeof input === 'number') chatId = input;

  if (!chatId) {
    console.error('ARTISTS: chatId не найден');
    return;
  }

  const all = loadLocalArtists();
  const total = all.length;
  if (!total) {
    const text = '👥 Информация об артистах временно недоступна.';
    if (msgId) return bot.editMessageText(text, { chat_id: chatId, message_id: msgId });
    return bot.sendMessage(chatId, text);
  }

  const from = requestedPage * PAGE_SIZE;
  const slice = all.slice(from, from + PAGE_SIZE);
  const text = buildArtistsText(slice, requestedPage);

  const buttons = [];
  if (from + PAGE_SIZE < total) {
    buttons.push({ text: 'Загрузить ещё', callback_data: `artists_page:${requestedPage + 1}` });
  }
  buttons.push({ text: '⬅️ Назад', callback_data: 'back_to_menu' });

  const reply_markup = { inline_keyboard: [buttons] };

  if (msgId) {
    return bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      reply_markup
    });
  }

  return bot.sendMessage(chatId, text, { parse_mode: 'Markdown', reply_markup });
};