const fs = require('fs');
const path = require('path');
const { editSmart } = require('../utils/editSmart');
const { genresMenu } = require('../keyboards/genresMenu');

const DATA = path.join(__dirname, '..', 'data', 'genres.json');

function loadGenres() {
  return JSON.parse(fs.readFileSync(DATA, 'utf8'));
}

exports.handleGenres = async (bot, input) => {
  return editSmart(bot, input, "🐅 *Жанры циркового искусства*\n\nВыберите категорию:", genresMenu.reply_markup);
};

exports.handleGenreItem = async (bot, input, id) => {
  const genres = loadGenres();
  const item = genres[id];

  if (!item) {
    return editSmart(bot, input, "Ошибка: жанр не найден", genresMenu.reply_markup);
  }

  const text =
    `*${item.title}*\n\n` +
    `${item.desc}\n\n` +
    (item.image ? `🖼 Фото: ${item.image}\n` : "") +
    (item.video ? `🎥 Видео: ${item.video}\n` : "") +
    `\n⬅️ Выберите другой жанр.`;

  return editSmart(bot, input, text, genresMenu.reply_markup);
};