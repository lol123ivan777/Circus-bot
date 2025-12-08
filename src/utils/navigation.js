// Унифицированная навигация, гарантия отсутствия спама

const { editSmart } = require('./editSmart');

async function go(bot, input, text, keyboard) {
  return editSmart(bot, input, text, keyboard);
}

async function goPhoto(bot, input, url, caption, keyboard) {
  return editSmart(bot, input, caption, keyboard);
}

module.exports = { go, goPhoto };