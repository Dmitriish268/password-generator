// Элементы DOM
const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const generateNewBtn = document.getElementById('generateNewBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const excludeSimilarCheck = document.getElementById('excludeSimilar');
const excludeAmbiguousCheck = document.getElementById('excludeAmbiguous');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const crackTime = document.getElementById('crackTime');
const combinations = document.getElementById('combinations');
const speedSelect = document.getElementById('speedSelect');
const toast = document.getElementById('toast');

// Символы для генерации
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const similarChars = 'il1Lo0O';
const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';

// Получение текущей скорости перебора из селектора
function getCurrentCrackSpeed() {
    return parseFloat(speedSelect.value);
}

// Обновление значения длины
lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
    generatePassword();
});

// Генерация пароля при изменении настроек
[uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck, excludeSimilarCheck, excludeAmbiguousCheck].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (hasAtLeastOneOption()) {
            generatePassword();
        }
    });
});

// Обновление времени взлома при изменении скорости
speedSelect.addEventListener('change', () => {
    const password = passwordOutput.value;
    if (password) {
        const length = password.length;
        const availableChars = getAvailableChars();
        updateCrackTime(password, length, availableChars.length);
    }
});

// Кнопки генерации
generateBtn.addEventListener('click', generatePassword);
generateNewBtn.addEventListener('click', generatePassword);

// Копирование пароля
copyBtn.addEventListener('click', copyPassword);

// Генерация пароля при загрузке
window.addEventListener('load', generatePassword);

// Проверка наличия хотя бы одной опции
function hasAtLeastOneOption() {
    return uppercaseCheck.checked || lowercaseCheck.checked || 
           numbersCheck.checked || symbolsCheck.checked;
}

// Получение доступных символов
function getAvailableChars() {
    let chars = '';
    
    if (uppercaseCheck.checked) {
        chars += uppercase;
    }
    if (lowercaseCheck.checked) {
        chars += lowercase;
    }
    if (numbersCheck.checked) {
        chars += numbers;
    }
    if (symbolsCheck.checked) {
        chars += symbols;
    }
    
    // Исключение похожих символов
    if (excludeSimilarCheck.checked) {
        chars = chars.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    // Исключение неоднозначных символов
    if (excludeAmbiguousCheck.checked) {
        chars = chars.split('').filter(char => !ambiguousChars.includes(char)).join('');
    }
    
    return chars;
}

// Генерация пароля
function generatePassword() {
    if (!hasAtLeastOneOption()) {
        showToast('Выберите хотя бы один тип символов!', 'warning');
        return;
    }
    
    const length = parseInt(lengthSlider.value);
    const availableChars = getAvailableChars();
    
    if (availableChars.length === 0) {
        showToast('Нет доступных символов для генерации!', 'error');
        return;
    }
    
    let password = '';
    const charArray = availableChars.split('');
    
    // Гарантируем наличие хотя бы одного символа каждого выбранного типа
    const requiredChars = [];
    if (uppercaseCheck.checked) {
        let char = uppercase[Math.floor(Math.random() * uppercase.length)];
        if (excludeSimilarCheck.checked && similarChars.includes(char)) {
            char = uppercase.split('').find(c => !similarChars.includes(c));
        }
        if (excludeAmbiguousCheck.checked && ambiguousChars.includes(char)) {
            char = uppercase.split('').find(c => !ambiguousChars.includes(c));
        }
        if (char) requiredChars.push(char);
    }
    if (lowercaseCheck.checked) {
        let char = lowercase[Math.floor(Math.random() * lowercase.length)];
        if (excludeSimilarCheck.checked && similarChars.includes(char)) {
            char = lowercase.split('').find(c => !similarChars.includes(c));
        }
        if (excludeAmbiguousCheck.checked && ambiguousChars.includes(char)) {
            char = lowercase.split('').find(c => !ambiguousChars.includes(c));
        }
        if (char) requiredChars.push(char);
    }
    if (numbersCheck.checked) {
        let char = numbers[Math.floor(Math.random() * numbers.length)];
        if (excludeSimilarCheck.checked && similarChars.includes(char)) {
            char = numbers.split('').find(c => !similarChars.includes(c));
        }
        if (excludeAmbiguousCheck.checked && ambiguousChars.includes(char)) {
            char = numbers.split('').find(c => !ambiguousChars.includes(c));
        }
        if (char) requiredChars.push(char);
    }
    if (symbolsCheck.checked) {
        let char = symbols[Math.floor(Math.random() * symbols.length)];
        if (excludeAmbiguousCheck.checked && ambiguousChars.includes(char)) {
            char = symbols.split('').find(c => !ambiguousChars.includes(c));
        }
        if (char) requiredChars.push(char);
    }
    
    // Добавляем обязательные символы
    password = requiredChars.join('');
    
    // Заполняем остаток пароля случайными символами
    for (let i = password.length; i < length; i++) {
        password += charArray[Math.floor(Math.random() * charArray.length)];
    }
    
    // Перемешиваем символы
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    passwordOutput.value = password;
    updateStrengthIndicator(password);
    updateCrackTime(password, length, availableChars.length);
}

// Расчет времени взлома
function calculateCrackTime(passwordLength, alphabetSize) {
    // Количество возможных комбинаций
    const totalCombinations = Math.pow(alphabetSize, passwordLength);
    
    // Получаем текущую скорость перебора
    const currentSpeed = getCurrentCrackSpeed();
    
    // Время в секундах (в худшем случае нужно перебрать все комбинации)
    // Используем средний случай - половина комбинаций
    const averageTimeSeconds = totalCombinations / (2 * currentSpeed);
    
    return {
        combinations: totalCombinations,
        timeSeconds: averageTimeSeconds,
        speed: currentSpeed
    };
}

// Форматирование времени в читаемый вид
function formatTime(seconds) {
    if (seconds < 1) {
        return { text: 'Мгновенно', class: 'instant' };
    }
    
    if (seconds < 60) {
        const secs = Math.floor(seconds);
        return { 
            text: `${secs} ${pluralize(secs, 'секунда', 'секунды', 'секунд')}`, 
            class: 'seconds' 
        };
    }
    
    const minutes = seconds / 60;
    if (minutes < 60) {
        const mins = Math.floor(minutes);
        return { 
            text: `${mins} ${pluralize(mins, 'минута', 'минуты', 'минут')}`, 
            class: 'seconds' 
        };
    }
    
    const hours = minutes / 60;
    if (hours < 24) {
        const hrs = Math.floor(hours);
        return { 
            text: `${hrs} ${pluralize(hrs, 'час', 'часа', 'часов')}`, 
            class: 'seconds' 
        };
    }
    
    const days = hours / 24;
    if (days < 365) {
        const d = Math.floor(days);
        return { 
            text: `${d} ${pluralize(d, 'день', 'дня', 'дней')}`, 
            class: 'seconds' 
        };
    }
    
    const years = days / 365;
    if (years < 100) {
        const y = Math.floor(years);
        return { 
            text: `${y} ${pluralize(y, 'год', 'года', 'лет')}`, 
            class: 'years' 
        };
    }
    
    const centuries = years / 100;
    if (centuries < 1000) {
        const c = Math.floor(centuries);
        return { 
            text: `${c} ${pluralize(c, 'век', 'века', 'веков')}`, 
            class: 'centuries' 
        };
    }
    
    const millennia = centuries / 10;
    if (millennia < 1e6) {
        const m = millennia.toFixed(1);
        return { 
            text: `${m} тысячелетий`, 
            class: 'centuries' 
        };
    }
    
    const millions = millennia / 1000;
    return { 
        text: `${millions.toExponential(2)} лет`, 
        class: 'centuries' 
    };
}

// Склонение слов
function pluralize(number, one, few, many) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    
    if (mod100 >= 11 && mod100 <= 19) {
        return many;
    }
    if (mod10 === 1) {
        return one;
    }
    if (mod10 >= 2 && mod10 <= 4) {
        return few;
    }
    return many;
}

// Форматирование больших чисел
function formatNumber(num) {
    if (num < 1000) {
        return num.toString();
    }
    if (num < 1e6) {
        return (num / 1000).toFixed(1) + ' тыс.';
    }
    if (num < 1e9) {
        return (num / 1e6).toFixed(1) + ' млн.';
    }
    if (num < 1e12) {
        return (num / 1e9).toFixed(1) + ' млрд.';
    }
    if (num < 1e15) {
        return (num / 1e12).toFixed(1) + ' трлн.';
    }
    if (num < 1e18) {
        return (num / 1e15).toFixed(1) + ' квадр.';
    }
    return num.toExponential(2);
}

// Форматирование скорости перебора
function formatSpeed(speed) {
    if (speed < 1e3) {
        return `${speed} попыток/сек`;
    }
    if (speed < 1e6) {
        return `${(speed / 1e3).toFixed(1)} тыс. попыток/сек`;
    }
    if (speed < 1e9) {
        return `${(speed / 1e6).toFixed(1)} млн. попыток/сек`;
    }
    if (speed < 1e12) {
        return `${(speed / 1e9).toFixed(1)} млрд. попыток/сек`;
    }
    return `${(speed / 1e12).toFixed(1)} трлн. попыток/сек`;
}

// Обновление информации о времени взлома
function updateCrackTime(password, length, alphabetSize) {
    if (!password || alphabetSize === 0) {
        crackTime.textContent = '—';
        crackTime.className = 'crack-time-value';
        combinations.textContent = '—';
        return;
    }
    
    const crackData = calculateCrackTime(length, alphabetSize);
    const timeInfo = formatTime(crackData.timeSeconds);
    
    crackTime.textContent = timeInfo.text;
    crackTime.className = `crack-time-value ${timeInfo.class}`;
    combinations.textContent = formatNumber(crackData.combinations);
}

// Проверка надежности пароля
function calculatePasswordStrength(password) {
    let strength = 0;
    let feedback = '';
    
    // Длина
    if (password.length >= 12) strength += 2;
    else if (password.length >= 8) strength += 1;
    
    // Разнообразие символов
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
    
    const charTypes = [hasUpper, hasLower, hasNumbers, hasSymbols].filter(Boolean).length;
    strength += charTypes;
    
    // Дополнительные проверки
    if (password.length >= 16) strength += 1;
    if (password.length >= 20) strength += 1;
    
    // Определение уровня надежности
    if (strength <= 2) {
        return { level: 'weak', text: 'Слабый', score: strength };
    } else if (strength <= 4) {
        return { level: 'medium', text: 'Средний', score: strength };
    } else if (strength <= 6) {
        return { level: 'strong', text: 'Сильный', score: strength };
    } else {
        return { level: 'very-strong', text: 'Очень сильный', score: strength };
    }
}

// Обновление индикатора надежности
function updateStrengthIndicator(password) {
    if (!password) {
        strengthFill.className = 'strength-fill';
        strengthText.textContent = '—';
        strengthText.className = 'strength-text';
        return;
    }
    
    const strength = calculatePasswordStrength(password);
    
    strengthFill.className = `strength-fill ${strength.level}`;
    strengthText.textContent = strength.text;
    strengthText.className = `strength-text ${strength.level}`;
}

// Копирование пароля в буфер обмена
async function copyPassword() {
    const password = passwordOutput.value;
    
    if (!password) {
        showToast('Нет пароля для копирования!', 'warning');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(password);
        showToast('Пароль скопирован в буфер обмена!', 'success');
        
        // Визуальная обратная связь
        copyBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            copyBtn.style.transform = '';
        }, 150);
    } catch (err) {
        // Fallback для старых браузеров
        passwordOutput.select();
        document.execCommand('copy');
        showToast('Пароль скопирован!', 'success');
    }
}

// Показ уведомления
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Предотвращение изменения пароля вручную (опционально)
passwordOutput.addEventListener('input', () => {
    const password = passwordOutput.value;
    const length = password.length;
    const availableChars = getAvailableChars();
    updateStrengthIndicator(password);
    updateCrackTime(password, length, availableChars.length);
});
