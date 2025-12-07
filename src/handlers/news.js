// src/handlers/news.js
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const PAGE_SIZE = 5;

// Простая in-memory кеш-структура (для демонстрации)
const cache = {
  articles: [],
  fetchedAt: 0
};

async function fetchArticlesFromSite() {
  // Если кеш свежий (10 минут) — возвращаем
  const now = Date.now();
  if (cache.articles.length && now - cache.fetchedAt < 1000 * 60 * 10) {
    return cache.articles;
  }

  // Попробуем парсить раздел новостей сайта
  const url = 'https://circusnikulin.ru/'; // если есть конкретная страница — подставь
  const res = await fetch(url, { timeout: 10000 });
  const html = await res.text();
  const $ = cheerio.load(html);

  const articles = [];

  // Ниже примерный селектор — возможно на сайте другой DOM.
  // Нужно подправить под реальные селекторы сайта circusnikulin.ru
  $('.news-item, .post, .news').each((i, el) => {
    const title = $(el).find('h3, h2, .title').first().text().trim();
    const link = $(el).find('a').first().attr('href') || '';
    const date = $(el).find('.date, .meta, time').first().text().trim();
    const summary = $(el).find('p').first().text().trim();

    if (title) {
      articles.push({
        title,
        url: link.startsWith('http') ? link : new URL(link, url).href,
        date,
        summary
      });
    }
  });

  // Fallback: если селекторы не сработали, возвращаем пустой массив
  cache.articles = articles;
  cache.fetchedAt = now;
  return articles;
}

function buildNewsText(items, page, total) {
  let text = `📰 *Новости — страница ${page+1}* \n\n`;
  items.forEach((a, idx) => {
    text += `*${page*PAGE_SIZE + idx + 1}.* [${a.title}](${a.url})\n`;
    if (a.date) text += `_ ${a.date}_\n`;
    if (a.summary) text += `${a.summary}\n`;
    text += `\n`;
  });
  text += `_Всего новостей: ${total}_`;
  return text;
}

exports.handleNews = async (bot, input, msgId = null) => {
  // определяем chatId и страницу (если callback_data содержит page)
  let chatId = null;
  let requestedPage = 0;

  // если input — callback_query
  if (input && input.data && input.message) {
    chatId = input.message.chat.id;
    // data может быть "news" или "news_page:2"
    if (input.data && input.data.startsWith('news_page:')) {
      requestedPage = parseInt(input.data.split(':')[1], 10) || 0;
    }
  }

  // если input — message или chatId
  if (!chatId && input && input.chat && input.chat.id) chatId = input.chat.id;
  if (!chatId && typeof input === 'number') chatId = input;

  if (!chatId) {
    console.error('NEWS: chatId не найден');
    return;
  }

  // получаем статьи
  const all = await fetchArticlesFromSite();
  const total = all.length;

  if (!total) {
    const text = '📭 Пока нет доступных новостей (не удалось распарсить сайт).';
    if (msgId) {
      return bot.editMessageText(text, { chat_id: chatId, message_id: msgId });
    }
    return bot.sendMessage(chatId, text);
  }

  const from = requestedPage * PAGE_SIZE;
  const items = all.slice(from, from + PAGE_SIZE);

  const text = buildNewsText(items, requestedPage, total);

  // inline-клавиатура для пагинации
  const buttons = [];
  if (from + PAGE_SIZE < total) {
    buttons.push({ text: 'Загрузить ещё', callback_data: `news_page:${requestedPage + 1}` });
  }
  // назад в меню
  buttons.push({ text: '⬅️ Назад', callback_data: 'back_to_menu' });

  const reply_markup = { inline_keyboard: [buttons] };

  if (msgId) {
    return bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup
    });
  }
  return bot.sendMessage(chatId, text, { parse_mode: 'Markdown', disable_web_page_preview: true, reply_markup });
};