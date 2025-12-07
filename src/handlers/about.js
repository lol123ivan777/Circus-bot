const fs = require('fs');
const path = require('path');
const { mainMenuKeyboard } = require('../keyboards/mainMenu');

function handleAbout(bot, chatId) {
  const filePath = path.join(__dirname, '..', 'data', 'about.txt');
  const text = fs.readFileSync(filePath, 'utf8');
  bot.sendMessage(chatId, text, mainMenuKeyboard);
}

module.exports = { handleAbout };