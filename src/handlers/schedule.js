const fs = require('fs');
const path = require('path');
const { mainMenuKeyboard } = require('../keyboards/mainMenu');

function handleSchedule(bot, chatId) {
  const filePath = path.join(__dirname, '..', 'data', 'schedule.txt');
  const text = fs.readFileSync(filePath, 'utf8');
  bot.sendMessage(chatId, text, mainMenuKeyboard);
}

module.exports = { handleSchedule };