// src/handlers/artists.js

const editSmart = require('../utils/editSmart');
const artists = require('../data/artists'); // массив артистов
const PAGE_SIZE = 3;

function buildPage(page) {
  const start = page * PAGE_SIZE;
  const slice = artists.slice(start, start + PAGE_SIZE);

  let text = "✨ *Артисты цирка*\n\n";
  slice.forEach((item, index) => {
    text += `*${start + index + 1}.* ${item}\n\n`;
  });

  return text;
}

function buildKeyboard(page) {
  const maxPage = Math.floor((artists.length - 1) / PAGE_SIZE);

  const buttons = [];

  if (page > 0) {
    buttons.push({ text: "⬅️ Назад", callback_data: `artists_page_${page - 1}` });
  }

  if (page < maxPage) {
    buttons.push({ text: "➡️ Далее", callback_data: `artists_page_${page + 1}` });
  }

  return [
    buttons,
    [{ text: "🏠 Меню", callback_data: "back_to_menu" }]
  ];
}

exports.handleArtists = async (bot, input) => {
  const page = 0;
  return editSmart(bot, input, buildPage(page), {
    inline_keyboard: buildKeyboard(page)
  });
};

exports.handleArtistsPage = async (bot, input) => {
  const data = input.data;
  const page = Number(data.split("_").pop());

  return editSmart(bot, input, buildPage(page), {
    inline_keyboard: buildKeyboard(page)
  });
};