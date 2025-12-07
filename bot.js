cat > src/bot.js <<'EOF'
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// простая клавиатура (reply keyboard)
const mainKeyboard = Markup.keyboard([
  ['🎪 Афиша', '🎟 Купить билеты'],
  ['📍 Контакты', '❓ FAQ']
]).resize();

bot.start((ctx) => {
  ctx.reply('Добро пожаловать в бот CircusNikulin!', mainKeyboard);
});

// делегируем текстовые кнопки на handler'ы
bot.on('text', async (ctx) => {
  const t = (ctx.message.text || '').trim();
  if (t === '🎪 Афиша') return ctx.scene?.enter ? ctx.reply('Афиша...') : ctx.reply('Открываю Афишу...');
  if (t === '🎟 Купить билеты') return ctx.reply('Открываю раздел билетов...');
  if (t === '📍 Контакты') return ctx.reply('Адрес: ... Телефон: ...');
  if (t === '❓ FAQ') return ctx.reply('Часто задаваемые вопросы...');
  // fallback
  ctx.reply('Не понял. Используй меню.');
});

bot.launch().then(()=>console.log('Bot launched'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
EOF
