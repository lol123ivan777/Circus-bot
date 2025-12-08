// src/handlers/genres.js
const fs = require('fs');
const path = require('path');
const editSmart = require('../utils/editSmart');

// грузим JSON с трюками
const GENRES = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'genres.json'), 'utf8')
);

// Названия для кнопок
const GENRE_LABELS = {
  juggling: "🎪 Жонглирование",
  clown: "🤡 Клоунада",
  aerial: "🤸 Воздушные гимнасты"
};

// ===== 1. МЕНЮ ЖАНРОВ =====
exports.handleGenres = async (bot, input) => {
  let text = "🎭 *Жанры циркового искусства*\n\nВыберите жанр.";

  const inline_keyboard = Object.keys(GENRES).map(key => [
    { text: GENRE_LABELS[key], callback_data: `genre:${key}` }
  ]);

  inline_keyboard.push([{ text: "⬅️ Назад в меню", callback_data: "back_to_menu" }]);

  return editSmart(bot, input, text, { inline_keyboard });
};

// ===== 2. ПОКАЗ КОНКРЕТНОГО ЖАНРА =====
exports.handleGenreItem = async (bot, query) => {
  const genreId = query.data.split(":")[1];
  const tricks = GENRES[genreId];

  if (!tricks) {
    return editSmart(bot, query, "*Жанр временно недоступен*", {
      inline_keyboard: [
        [{ text: "⬅️ Назад", callback_data: "genres" }],
        [{ text: "⬅️ В меню", callback_data: "back_to_menu" }]
      ]
    });
  }

  // текст жанра
  let text = `*${GENRE_LABELS[genreId]}*\n\n`;
  text += "Доступные элементы:\n\n";

  tricks.forEach((t, i) => {
    text += `*${i + 1}.* ${t}\n`;
  });

  const inline_keyboard = [
    [{ text: "🎲 Сгенерировать связку", callback_data: `genre_mix:${genreId}` }],
    [{ text: "⬅️ Назад к жанрам", callback_data: "genres" }],
    [{ text: "⬅️ В меню", callback_data: "back_to_menu" }]
  ];

  return editSmart(bot, query, text, { inline_keyboard });
};

// ===== 3. ИИ-МИКС (рандомный подбор трюков) =====
exports.handleGenreMix = async (bot, query) => {
  const genreId = query.data.split(":")[1];
  const tricks = GENRES[genreId];

  if (!tricks) {
    return editSmart(bot, query, "*Ошибка жанра*", {
      inline_keyboard: [[{ text: "⬅️ Назад", callback_data: "genres" }]]
    });
  }

  // выбираем 3 случайных элемента
  const mix = [...tricks]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  let text = `🎲 *Связка для жанра ${GENRE_LABELS[genreId]}*\n\n`;
  mix.forEach((t, i) => (text += `*${i + 1}.* ${t}\n`));

  const inline_keyboard = [
    [{ text: "🔄 Ещё вариант", callback_data: `genre_mix:${genreId}` }],
    [{ text: "⬅️ Назад", callback_data: `genre:${genreId}` }],
    [{ text: "⬅️ В меню", callback_data: "back_to_menu" }]
  ];

  return editSmart(bot, query, text, { inline_keyboard });
};