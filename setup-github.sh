#!/bin/bash

# Скрипт для автоматического создания и настройки GitHub репозитория
# Использование: ./setup-github.sh YOUR_USERNAME REPO_NAME

set -e

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Настройка GitHub репозитория для Password Generator${NC}\n"

# Проверка аргументов
if [ -z "$1" ] || [ -z "$2" ]; then
    echo -e "${YELLOW}Использование: ./setup-github.sh YOUR_USERNAME REPO_NAME${NC}"
    echo "Пример: ./setup-github.sh dmitriisharin password-generator"
    exit 1
fi

USERNAME=$1
REPO_NAME=$2

echo -e "${GREEN}✓${NC} Username: $USERNAME"
echo -e "${GREEN}✓${NC} Repository name: $REPO_NAME"
echo ""

# Проверка, что мы в git репозитории
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Инициализация git репозитория...${NC}"
    git init
    git add .
    git commit -m "Initial commit: Password Generator"
fi

# Проверка существования remote
if git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}Remote 'origin' уже существует. Обновление...${NC}"
    git remote set-url origin "https://github.com/$USERNAME/$REPO_NAME.git"
else
    echo -e "${GREEN}Добавление remote 'origin'...${NC}"
    git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git"
fi

# Переименование ветки в main если нужно
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo -e "${GREEN}Переименование ветки в 'main'...${NC}"
    git branch -M main
fi

echo ""
echo -e "${YELLOW}📝 Следующие шаги:${NC}"
echo ""
echo -e "1. Создайте репозиторий на GitHub:"
echo -e "   ${BLUE}https://github.com/new${NC}"
echo ""
echo -e "   Название: ${GREEN}$REPO_NAME${NC}"
echo -e "   Описание: Современный генератор паролей с расчетом времени взлома"
echo -e "   Видимость: Public или Private"
echo -e "   ${YELLOW}НЕ добавляйте README, .gitignore или лицензию!${NC}"
echo ""
echo -e "2. После создания репозитория выполните:"
echo -e "   ${BLUE}git push -u origin main${NC}"
echo ""
echo -e "3. (Опционально) Настройте GitHub Pages:"
echo -e "   Settings → Pages → Source: ${GREEN}main${NC} branch"
echo ""
echo -e "${GREEN}✓${NC} Все готово! Репозиторий настроен локально."

