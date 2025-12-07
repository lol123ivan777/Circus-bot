module.exports.handleStart = function (bot, msg) {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    'Главное меню цирка Никулина:',
    require('../keyboards/mainMenu').mainMenuKeyboard
  );
};