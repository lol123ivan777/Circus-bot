#!/data/data/com.termux/files/usr/bin/bash

REPO_DIR="$HOME/circus-bot"
BRANCH="main"
LOGFILE="$HOME/autopull.log"
NODE_FILE="bot.js"

cd "$REPO_DIR" || {
  echo "Ошибка: Папка $REPO_DIR не найдена" >> "$LOGFILE"
  exit 1
}

echo "===== Autopull стартовал $(date) =====" >> "$LOGFILE"

while true
do
  echo "--- $(date) проверка обновлений ---" >> "$LOGFILE"

  git fetch origin "$BRANCH" >> "$LOGFILE" 2>&1

  LOCAL=$(git rev-parse "$BRANCH")
  REMOTE=$(git rev-parse "origin/$BRANCH")

  if [ "$LOCAL" != "$REMOTE" ]; then
    echo "$(date) >>> Обновления найдены" >> "$LOGFILE"
    git pull >> "$LOGFILE" 2>&1

    # убить старый бот
    pkill -f "$NODE_FILE"

    # запустить новый бот
    node "$NODE_FILE" >> "$LOGFILE" 2>&1 &
  fi

  sleep 5
done