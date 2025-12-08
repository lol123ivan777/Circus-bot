// src/utils/navigation.js
const editSmart = require('./editSmart');

async function go(bot, input, text, extra = {}) {
  return editSmart(bot, input, text, extra);
}

async function goPhoto(bot, input, url, caption, extra = {}) {
  // при желании можно сделать отдельную логику для фото
  return editSmart(bot, input, caption, extra);
}

module.exports = { go, goPhoto };