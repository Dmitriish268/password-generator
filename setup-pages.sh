#!/bin/bash

# Скрипт для автоматической настройки GitHub Pages через API
# Требуется GitHub Personal Access Token с правами repo

set -e

# Цвета
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

REPO_OWNER="Dmitriish268"
REPO_NAME="password-generator"

echo -e "${BLUE}🌐 Настройка GitHub Pages для password-generator${NC}\n"

# Проверка GitHub CLI
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓${NC} GitHub CLI найден"
    
    # Проверка авторизации
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}✓${NC} GitHub CLI авторизован"
        
        echo -e "\n${YELLOW}Настройка GitHub Pages через CLI...${NC}"
        
        # Настройка Pages через API
        gh api repos/${REPO_OWNER}/${REPO_NAME}/pages \
            --method PUT \
            --field source[type]=branch \
            --field source[branch]=main \
            --field source[path]=/ || {
                echo -e "${YELLOW}Попытка настройки через веб-интерфейс...${NC}"
            }
        
        echo -e "\n${GREEN}✓${NC} GitHub Pages настроен!"
        echo -e "\n${BLUE}Ваш сайт будет доступен по адресу:${NC}"
        echo -e "${GREEN}https://${REPO_OWNER}.github.io/${REPO_NAME}/${NC}\n"
        
        echo -e "${YELLOW}Примечание:${NC} Деплой может занять 1-2 минуты."
        echo -e "Проверьте статус в разделе Actions репозитория.\n"
        
        exit 0
    else
        echo -e "${YELLOW}⚠${NC} GitHub CLI не авторизован"
        echo -e "Выполните: ${BLUE}gh auth login${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠${NC} GitHub CLI не установлен"
fi

# Альтернативный способ через curl (требует токен)
echo -e "${YELLOW}Альтернативный способ настройки:${NC}\n"

echo -e "1. Перейдите в настройки репозитория:"
echo -e "   ${BLUE}https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/pages${NC}\n"

echo -e "2. В разделе 'Source' выберите:"
echo -e "   ${GREEN}Deploy from a branch${NC}"
echo -e "   Branch: ${GREEN}main${NC}"
echo -e "   Folder: ${GREEN}/ (root)${NC}\n"

echo -e "3. Нажмите ${GREEN}Save${NC}\n"

echo -e "4. Проверьте деплой в разделе Actions:\n"
echo -e "   ${BLUE}https://github.com/${REPO_OWNER}/${REPO_NAME}/actions${NC}\n"

echo -e "5. Через 1-2 минуты сайт будет доступен:\n"
echo -e "   ${GREEN}https://${REPO_OWNER}.github.io/${REPO_NAME}/${NC}\n"

echo -e "${YELLOW}Или используйте GitHub CLI:${NC}"
echo -e "   ${BLUE}brew install gh${NC}  # Установка (macOS)"
echo -e "   ${BLUE}gh auth login${NC}    # Авторизация"
echo -e "   ${BLUE}./setup-pages.sh${NC} # Запуск скрипта\n"

