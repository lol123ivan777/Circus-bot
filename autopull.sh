#!/data/data/com.termux/files/usr/bin/bash

REPO_DIR="$HOME/circusbot"   # здесь путь к твоему репо
BRANCH="main"
LOGFILE="$HOME/autopull.log"

cd "$REPO_DIR" || exit

while true; do
    git fetch origin "$BRANCH"

    LOCAL=$(git rev-parse "$BRANCH")
    REMOTE=$(git rev-parse "origin/$BRANCH")

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "$(date): Обновление найдено. Тяну..." >> "$LOGFILE"
        git pull
        pkill node
        node bot.js &
        echo "$(date): Перезапустил бота" >> "$LOGFILE"
    fi

    sleep 4
done

