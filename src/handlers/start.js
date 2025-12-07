exports.handleStart = (bot, msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Это тест старта.');
};