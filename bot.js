require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

bot.onText(//start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🟢 Бот запущен! Работает на Termux + Node.js 🚀');
});

console.log('🤖 Бот запущен в Termux');
