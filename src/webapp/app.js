// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;

// Подстраиваемся под тему Telegram
function applyTheme() {
  if (!tg) return;

  const isDark = tg.colorScheme === "dark";
  if (!isDark) {
    document.body.classList.add("light");
  }

  // Расширяем WebApp на весь экран
  tg.expand();
}

// Демонстрационное расписание (потом заменим данными из schedule.json)
const demoSchedule = [
  { date: "20 декабря", day: "Суббота", times: ["11:00", "14:30", "18:00"] },
  { date: "21 декабря", day: "Воскресенье", times: ["11:00", "14:30", "18:00"] },
  { date: "24 декабря", day: "Среда", times: ["18:00"] },
  { date: "31 декабря", day: "Среда", times: ["14:30", "18:00"] }
];

function renderSchedule() {
  const list = document.getElementById("schedule-list");
  if (!list) return;

  list.innerHTML = "";

  demoSchedule.forEach(item => {
    const div = document.createElement("div");
    div.className = "list-item";
    const times = item.times.join(", ");
    div.innerHTML = `<strong>${item.date}</strong> · ${item.day}<br/>Сеансы: ${times}`;
    list.appendChild(div);
  });
}

function setupButtons() {
  const btn = document.getElementById("btn-open-telegram");
  if (!btn || !tg) return;

  btn.addEventListener("click", () => {
    // Просто закрываем WebApp — пользователь остаётся в чате с ботом
    tg.close();
  });
}

// Старт
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  renderSchedule();
  setupButtons();
});
