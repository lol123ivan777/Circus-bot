// src/handlers/artists.js
const path = require('path');
const fs = require('fs');
const { editSmart } = require('../utils/editSmart');

const PAGE_SIZE = 3;
const DATA_FILE = path.join(__dirname, '..', 'data', 'artists.json');

function loadArtists() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('artists: load failed:', e.message || e);
    return [
      { name: 'Иван Иванов', role: 'Клоун', bio: 'Веселый клоун.' },
      { name: 'Петр Петров', role: 'Акробат', bio: 'Экстремальный акробат.' },
      { name: 'Света Светлова', role: 'Воздушная гимнастка', bio: 'Гибкая и смелая.' },
      { name: 'Мария Белова', role: 'Дрессировщица', bio: 'Заботится о животных.' },
      { name: 'Алексей Смирнов', role: 'Жонглёр', bio: 'Мастер бросков.' },
      { name: 'Наташа Романова', role: 'Иллюзионистка', bio: 'Таинственная и харизматичная.' }
    ];
  }
}

function formatArtists(slice, page, total) {
  let text = `✨ *Артисты — страница ${page + 1}* \n\n`;
  slice.forEach((a, i) => {
    text += `*${page * PAGE_SIZE + i + 1}.* ${a.name} — _${a.role}_\n`;
    if (a.bio) text += `${a.bio}\n`;
    text += `\n`;
  });
  text += `_Всего артистов: ${total}_`;
  return text;
}

exports.handleArtists = async (bot, input) => {
  let page = 0;
  if (input?.data && input.data.startsWith('artists_page:')) {
    page = parseInt(input.data.split(':')[1], 10) || 0;
  }

  const all = loadArtists();
  const total = all.length;
  const from = page * PAGE_SIZE;
  const slice = all.slice(from, from + PAGE_SIZE);
  const text = formatArtists(slice, page, total);

  const buttons = [];
  if (from + PAGE_SIZE < total) buttons.push({ text: 'Загрузить ещё', callback_data: `artists_page:${page + 1}` });
  buttons.push({ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' });

  const reply_markup = { inline_keyboard: [buttons] };
  return editSmart(bot, input, text, reply_markup);
};