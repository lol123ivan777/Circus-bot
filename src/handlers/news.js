// src/handlers/news.js
const axios = require('axios');
const cheerio = require('cheerio');
const { editSmart } = require('../utils/editSmart');
const { backKeyboard } = require('../keyboards/backKeyboard');
const path = require('path');
const fs = require('fs');

const PAGE_SIZE = 3;
const DATA_FILE = path.join(__dirname, '..', 'data', 'news.json');

// simple loader: prefer remote parse, fallback to local JSON
async function fetchArticles() {
  // try parsing site (best-effort)
  try {
    const url = 'https://circusnikulin.ru/'; // сменишь, если нужна конкретная страница
    const res = await axios.get(url, { timeout: 8000 });
    const $ = cheerio.load(res.data);
    const articles = [];

    // примерный парсер — возможно нужно подогнать под реальную разметку
    $('.news, .post, .news-item').each((i, el) => {
      const title = $(el).find('h2, h3').first().text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const date = $(el).find('.date, time').first().text().trim();
      const summary = $(el).find('p').first().text().trim();
      if (title) articles.push({ title, url: link.startsWith('http') ? link : new URL(link, url).href, date, summary });
    });

    if (articles.length) {
      // save snapshot to local
      try { fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2)); } catch {}
      return articles;
    }
  } catch (e) {
    console.warn('news: remote parse failed:', e.message || e);
  }

  // fallback to local file
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('news: local fallback failed:', e.message || e);
    // final fallback: sample stub
    return [
      { title: 'Новости: премьера новой программы', url: '#', date: '2025-12-01', summary: 'Краткое описание...' },
      { title: 'Новости: мастер-класс от артистов', url: '#', date: '2025-11-20', summary: 'Краткое описание...' },
      { title: 'Новости: акция на билеты', url: '#', date: '2025-11-10', summary: 'Краткое описание...' },
      { title: 'Новости: интервью', url: '#', date: '2025-10-30', summary: 'Краткое описание...' },
      { title: 'Новости: гастроли', url: '#', date: '2025-10-15', summary: 'Краткое описание...' },
      { title: 'Новости: дети в цирке', url: '#', date: '2025-09-01', summary: 'Краткое описание...' }
    ];
  }
}

function formatPage(items, page, total) {
  let text = `📰 *Новости — страница ${page + 1}* \n\n`;
  items.forEach((a, idx) => {
    text += `*${page * PAGE_SIZE + idx + 1}.* ${a.title}\n`;
    if (a.date) text += `_${a.date}_\n`;
    if (a.summary) text += `${a.summary}\n`;
    if (a.url && a.url !== '#') text += `${a.url}\n`;
    text += `\n`;
  });
  text += `_Всего: ${total}_`;
  return text;
}

exports.handleNews = async (bot, input) => {
  // detect page
  let page = 0;
  if (input?.data && input.data.startsWith('news_page:')) {
    page = parseInt(input.data.split(':')[1], 10) || 0;
  }

  const articles = await fetchArticles();
  const total = articles.length;
  const from = page * PAGE_SIZE;
  const pageItems = articles.slice(from, from + PAGE_SIZE);
  const text = formatPage(pageItems, page, total);

  // build pagination keyboard
  const buttons = [];
  if (from + PAGE_SIZE < total) buttons.push({ text: 'Загрузить ещё', callback_data: `news_page:${page + 1}` });
  buttons.push({ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' });

  const reply = { reply_markup: { inline_keyboard: [buttons] } };

  return editSmart(bot, input, text, reply.reply_markup);
};