// src/handlers/news.js

// Хардкод массива новостей. Потом можно заменить на парсер или API.
const NEWS = [
  { date: '28 февраля 2025', title: 'Приглашаем на экскурсию в «Клуб-музей Цирка»', link: 'https://circusnikulin.ru/news' },
  { date: '15 августа 2024', title: 'Грани Георгия Гараняна в Московском Цирке Никулина', link: 'https://circusnikulin.ru/news' },
  { date: '22 марта 2024', title: 'Отмена представлений 23-24 марта 2024', link: 'https://circusnikulin.ru/news/161' },
  { date: '23 января 2024', title: 'Забытые вещи', link: 'https://circusnikulin.ru/news' },
  { date: '20 января 2024', title: 'Билеты на безвозмездной основе', link: 'https://circusnikulin.ru/news' },
  { date: '5 сентября 2023', title: 'Благодарность АО "Газпромбанк"', link: 'https://circusnikulin.ru/news' },
  { date: '19 июня 2023', title: 'Гастроли цирка в Екатеринбурге', link: 'https://circusnikulin.ru/news' },
  { date: '15 апреля 2022', title: 'Благодарность Президентскому фонду и Meyer Sound', link: 'https://circusnikulin.ru/news' },
];

// Сколько показывать за один раз
const PAGE_SIZE = 5;

// Генерация текста
function buildNewsPage(page) {
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const slice = NEWS.slice(start, end);

  const header = '📰 *Новости Цирка Никулина* 📰\n\n';
  const body = slice
    .map(n => `*${n.date}* — [${n.title}](${n.link})`)
    .join('\n');

  return header + body;
}

// Главное меню пагинации
function newsKeyboard(page) {
  const buttons = [];

  if (page > 0) {
    buttons.push([{ text: '← Назад', callback_data: `news_page_${page - 1}` }]);
  }

  if ((page + 1) * PAGE_SIZE < NEWS.length) {
    buttons.push([{ text: 'Дальше →', callback_data: `news_page_${page + 1}` }]);
  }

  // Кнопка выхода
  buttons.push([{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]);

  return { inline_keyboard: buttons };
}

exports.handleNews = (bot, chatId) => {
  const page = 0;

  bot.sendMessage(chatId, buildNewsPage(page), {
    parse_mode: 'Markdown',
    reply_markup: newsKeyboard(page)
  });
};

// Обработчик callback-кнопок для пагинации
exports.handleNewsCallback = (bot, query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!data.startsWith('news_page_')) return;

  const page = parseInt(data.replace('news_page_', ''), 10);

  bot.editMessageText(buildNewsPage(page), {
    chat_id: chatId,
    message_id: query.message.message_id,
    parse_mode: 'Markdown',
    reply_markup: newsKeyboard(page)
  });

  bot.answerCallbackQuery(query.id);
};