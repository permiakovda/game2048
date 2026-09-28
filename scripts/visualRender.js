// импорт цветов из файла config.css
const TitleBG_2 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_2');
const TitleBG_4 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_4');
const TitleBG_8 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_8');
const TitleBG_16 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_16');
const TitleBG_32 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_32');
const TitleBG_64 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_64');
const TitleBG_128 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_128');
const TitleBG_256 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_256');
const TitleBG_512 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_512');
const TitleBG_1024 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_1024');
const TitleBG_2048 = getComputedStyle(document.documentElement).getPropertyValue('--colors-TitleBG_2048');

// модуль визуализации и рендера игрового поял и игровых плиток

/**
 * Создает HTML-элемент <canvas> и добавляет его в DOM.
 *
 * @param {Object} options - Настройки холста.
 * @param {number} [options.width=800] - Ширина холста в пикселях.
 * @param {number} [options.height=600] - Высота холста в пикселях.
 * @param {string} [options.id='game-canvas'] - ID элемента (нужен для стилей CSS).
 * @param {HTMLElement|string} [options.parent=document.body] - Родительский узел или его селектор.
 * @param {boolean} [options.retina=false] - Включить поддержку Retina-экранов (умножает размер на devicePixelRatio).
 * @returns {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }} Объект с холстом и 2D-контекстом.
 */
function gameFildRender(options = {}) {
    const settings = {
        width: 800,
        height: 600,
        id: 'game-canvas',
        parent: document.body,
        ...options
    };

    // Находим родительский элемент, если передан строковый селектор
    if (typeof settings.parent === 'string') {
        settings.parent = document.querySelector(settings.parent);
        if (!settings.parent) {
            throw new Error(`Parent element with selector "${options.parent}" not found.`);
        }
    }

    const canvas = document.createElement('canvas');

    canvas.width = settings.width;
    canvas.height = settings.height;

    canvas.id = settings.id;
    canvas.classList.add('game-canvas');

    // Добавляем в DOM
    settings.parent.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    return { canvas, ctx };
}

/**
 * Отрисовывает игровую плитку со скругленными углами на Canvas с поддержкой внутреннего отступа (padding).
 * Функция сначала рисует внешнюю рамку/тень, а затем накладывает поверх неё основную плитку.
 *
 * @param {number} coordinateX - Координата X левого верхнего угла внешней границы плитки.
 * @param {number} coordinateY - Координата Y левого верхнего угла внешней границы плитки.
 * @param {number} size - Общая ширина и высота внешней квадратной плитки в пикселях.
 * @param {CanvasRenderingContext2D} ctx - 2D контекст рендеринга элемента canvas.
 * @param {string|number|null|undefined} number - Значение (число или строка), которое будет выведено по центру плитки. Если null или undefined — текст не выводится.
 * @param {string} bgColor - CSS-цвет заливки основной части плитки (например, '#eee', 'rgb(240,240,240)' или 'lightblue').
 * @param {number} radius - Радиус скругления углов в пикселях. Автоматически ограничивается половиной стороны во избежание артефактов.
 * @param {number} [padding=0] - Внутренний отступ между внешней границей и основным фоном в пикселях. 
 *                               Не может быть меньше 0 и больше половины размера плитки. По умолчанию равен 0 (отступ отсутствует).
 */
function gameTileRender(coordinateX, coordinateY, size, ctx, number = 2, radius = 0, padding = 0) {
    // Ограничиваем отступ: он не может быть меньше 0 и больше половины размера минус 1px (для минимального внутреннего квадрата)
    const actualPadding = Math.max(0, Math.min(padding, (size - 1) / 2));

    // Параметры внешней границы (полный размер)
    const safeRadiusFull = Math.min(radius, size / 2);

    // Параметры внутренней плитки (с учетом отступа)
    const innerSize = size - 2 * actualPadding;
    const safeRadiusInner = Math.min(radius, innerSize / 2);

    // Координаты левого верхнего угла внутренней плитки
    const innerX = coordinateX + actualPadding;
    const innerY = coordinateY + actualPadding;

    // 1. Рисуем внешнюю рамку (тень/границу)
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    drawRoundedRect(ctx, coordinateX, coordinateY, size, safeRadiusFull);
    ctx.fill();

    // 2. Рисуем основную плитку поверх рамки со смещением
    ctx.fillStyle = tileColorSetBG(number);
    drawRoundedRect(ctx, innerX, innerY, innerSize, safeRadiusInner);
    ctx.fill();

    // 3. Опционально: выводим число по центру всей области (визуально будет по центру внутренней плитки)
    if (number !== undefined && number !== null && number.toString().trim() !== '') {
        ctx.fillStyle = '#000';
        // Размер шрифта привязан к доступной внутренней площади для сохранения пропорций
        ctx.font = `${Math.floor(innerSize / 3)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(number), coordinateX + size / 2, coordinateY + size / 2);
    }
}

// Вспомогательная функция рисования закругленного прямоугольника
function drawRoundedRect(ctx, x, y, side, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + side - r, y);
    ctx.quadraticCurveTo(x + side, y, x + side, y + r);
    ctx.lineTo(x + side, y + side - r);
    ctx.quadraticCurveTo(x + side, y + side, x + side - r, y + side);
    ctx.lineTo(x + r, y + side);
    ctx.quadraticCurveTo(x, y + side, x, y + side - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// Вспомогательная функция выбора цвета заднего фона плитки
function tileColorSetBG(number) {
    if (number === 2) {
        return TitleBG_2;
    } else if (number === 4) {
        return TitleBG_4
    } else if (number === 8) {
        return TitleBG_8
    } else if (number === 16) {
        return TitleBG_16
    } else if (number === 32) {
        return TitleBG_32
    } else if (number === 64) {
        return TitleBG_64
    } else if (number === 128) {
        return TitleBG_128
    } else if (number === 256) {
        return TitleBG_256
    } else if (number === 512) {
        return TitleBG_512
    } else if (number === 1024) {
        return TitleBG_1024
    } else if (number === 2048) {
        return TitleBG_2048
    }else{
        throw new Error('неизвесная цифра.');
    }

}

export { gameFildRender, gameTileRender };
