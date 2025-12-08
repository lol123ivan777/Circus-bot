// src/handlers/schedule.js

const path = require('path');
const fs = require('fs');
const { editSmart } = require('../utils/editSmart');

const DATA_FILE = path.join(__dirname, '..', 'data', 'schedule.json');

function loadSchedule() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('schedule: load failed:', e.message || e);
    return [];
  }
}

const MONTH_NAMES = {
  1: 'Январь',
  2: 'Февраль',
  3: 'Март',
  4: 'Апрель',
  5: 'Май',
  6: 'Июнь',
  7: 'Июль',
  8: 'Август',
  9: 'Сентябрь',
  10: 'Октябрь',
  11: 'Ноябрь',
  12: 'Декабрь'
};

const MONTH_SHORT = {
  1: 'янв',
  2: 'фев',
  3: 'мар',
  4: 'апр',
  5: 'май',
  6: 'июн',
  7: 'июл',
  8: 'авг',
  9: 'сен',
  10: 'окт',
  11: 'ноя',
  12: 'дек'
};

const WEEKDAY_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

function getMonthKey(dateStr) {
  const [year, month] = dateStr.split('-').map(Number);
  return `${year}-${String(month).padStart(2, '0')}`;
}

function getMonthLabel(key) {
  const [year, month] = key.split('-').map(Number);
  return `${MONTH_NAMES[month]} ${year}`;
}

function buildMonthList(schedule) {
  const set = new Set();
  schedule.forEach(item => {
    if (item.date) set.add(getMonthKey(item.date));
  });
  return Array.from(set).sort();
}

function formatMonthListText() {
  return (
    '📅 *Расписание представлений*\n\n' +
    'Выберите месяц, затем листайте дни по неделям.\n'
  );
}

// Собираем по дате: date -> [times...]
function groupByDate(schedule, monthKey) {
  const map = {};
  schedule.forEach(item => {
    if (!item.date) return;
    if (getMonthKey(item.date) !== monthKey) return;

    if (!map[item.date]) map[item.date] = [];
    if (item.time) map[item.date].push(item.time);
  });

  // сортируем времена внутри дня
  Object.keys(map).forEach(date => {
    map[date] = Array.from(new Set(map[date])).sort();
  });

  return map;
}

// Формируем массив дней месяца с временем
function buildMonthDays(schedule, monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const byDate = groupByDate(schedule, monthKey);

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(year, month - 1, d);
    const weekdayShort = WEEKDAY_SHORT[dateObj.getDay()];
    const label = `${d} ${MONTH_SHORT[month]} (${weekdayShort})`;

    const times = byDate[dateStr] || [];

    days.push({
      day: d,
      label,
      times
    });
  }

  return days;
}

// Формируем текст одной "страницы" (7 дней)
function formatMonthPage(schedule, monthKey, pageIndex, pageSize = 7) {
  const days = buildMonthDays(schedule, monthKey);
  const totalPages = Math.max(1, Math.ceil(days.length / pageSize));

  const safePage = Math.min(Math.max(pageIndex, 0), totalPages - 1);
  const start = safePage * pageSize;
  const slice = days.slice(start, start + pageSize);

  const header = getMonthLabel(monthKey);
  let text = `🎭 *Расписание — ${header}*\n`;
  text += `Страница ${safePage + 1} из ${totalPages}\n\n`;

  slice.forEach(d => {
    if (d.times.length) {
      const timesStr = d.times.join(', ');
      text += `${d.label}: ${timesStr}\n`;
    } else {
      text += `${d.label}: ВЫХОДНОЙ\n`;
    }
  });

  text += '\n_Актуальная информация о билетах — на сайте цирка._';

  return { text, totalPages, page: safePage };
}

exports.handleSchedule = async (bot, input) => {
  const data = input?.data;
  const schedule = loadSchedule();

  // 1) Показать список месяцев
  if (!data || data === 'schedule') {
    const months = buildMonthList(schedule);

    const text = formatMonthListText();
    const monthButtons = months.map(m => ({
      text: getMonthLabel(m),
      callback_data: `schedule_month:${m}:0`
    }));

    const inline_keyboard = [
      ...monthButtons.map(btn => [btn]),
      [{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]
    ];

    return editSmart(bot, input, text, { inline_keyboard });
  }

  // 2) Конкретный месяц + страница
  if (data.startsWith('schedule_month:')) {
    const parts = data.split(':'); // ["schedule_month", "2025-12", "0"]
    const monthKey = parts[1];
    const pageIndex = parts[2] ? Number(parts[2]) || 0 : 0;

    const { text, totalPages, page } = formatMonthPage(schedule, monthKey, pageIndex);

    const inline_keyboard = [];

    // навигация по страницам
    const navRow = [];
    if (page > 0) {
      navRow.push({
        text: '⬅️ Назад',
        callback_data: `schedule_month:${monthKey}:${page - 1}`
      });
    }
    if (page < totalPages - 1) {
      navRow.push({
        text: '➡️ Далее',
        callback_data: `schedule_month:${monthKey}:${page + 1}`
      });
    }
    if (navRow.length) inline_keyboard.push(navRow);

    // кнопка к списку месяцев
    inline_keyboard.push([
      { text: '📅 К выбору месяца', callback_data: 'schedule' }
    ]);

    // назад в главное меню
    inline_keyboard.push([
      { text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }
    ]);

    return editSmart(bot, input, text, { inline_keyboard });
  }

  // fallback
  return editSmart(bot, input, '*Расписание временно недоступно*', {
    inline_keyboard: [
      [{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]
    ]
  });
};