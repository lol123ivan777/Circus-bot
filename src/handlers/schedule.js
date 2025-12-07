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

function formatMonthText() {
  return (
    '📅 *Расписание представлений*\n\n' +
    'Выберите месяц, чтобы посмотреть даты и время спектаклей.\n'
  );
}

function formatEventsForMonth(schedule, monthKey) {
  const events = schedule
    .filter(item => item.date && getMonthKey(item.date) === monthKey)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  if (!events.length) {
    return '*Расписание временно отсутствует для этого месяца.*';
  }

  const label = getMonthLabel(monthKey);
  let text = `🎭 *Расписание — ${label}*\n\n`;

  events.forEach((e, idx) => {
    text += `*${idx + 1}.* ${e.date} — ${e.time}\n`;
    if (e.title) text += `_${e.title}_\n`;
    if (e.ticket) text += `Билеты: ${e.ticket}\n`;
    text += '\n';
  });

  text += '_Актуальная информация о билетах — на сайте цирка._';
  return text;
}

exports.handleSchedule = async (bot, input) => {
  const data = input?.data;
  const schedule = loadSchedule();

  // 1) Показать список месяцев
  if (!data || data === 'schedule') {
    const months = buildMonthList(schedule);

    const text = formatMonthText();
    const monthButtons = months.map(m => ({
      text: getMonthLabel(m),
      callback_data: `schedule_month:${m}`
    }));

    const inline_keyboard = [
      ...monthButtons.map(btn => [btn]),
      [{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]
    ];

    return editSmart(bot, input, text, { inline_keyboard });
  }

  // 2) Конкретный месяц
  if (data.startsWith('schedule_month:')) {
    const monthKey = data.split(':')[1];
    const text = formatEventsForMonth(schedule, monthKey);

    const inline_keyboard = [
      [{ text: '📅 К выбору месяца', callback_data: 'schedule' }],
      [{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]
    ];

    return editSmart(bot, input, text, { inline_keyboard });
  }

  // fallback
  return editSmart(bot, input, '*Расписание временно недоступно*', {
    inline_keyboard: [[{ text: '⬅️ Назад в меню', callback_data: 'back_to_menu' }]]
  });
};