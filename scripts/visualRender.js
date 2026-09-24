// импорт цветов из файла config.css
const twoTitleBG = getComputedStyle(document.documentElement).getPropertyValue('--colors-twoTitleBG');


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
function gameFildRender (options = {}) {
    const settings = {
        width: 800,
        height: 600,
        id: 'game-canvas',
        parent: document.body,
        retina: false,
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
    
    let dpr = window.devicePixelRatio || 1;
    let displayWidth = settings.width;
    let displayHeight = settings.height;

    // Поддержка четкости на экранах с высокой плотностью пикселей
    if (settings.retina && dpr > 1) {
        canvas.width = settings.width * dpr;
        canvas.height = settings.height * dpr;
        canvas.style.width = `${settings.width}px`;
        canvas.style.height = `${settings.height}px`;
        displayWidth *= dpr;
        displayHeight *= dpr;
    } else {
        canvas.width = settings.width;
        canvas.height = settings.height;
    }

    canvas.id = settings.id;
    canvas.classList.add('game-canvas');

    // Добавляем в DOM
    settings.parent.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Масштабируем контекст для ретины, чтобы рисовать как обычно (в логических пикселях)
    if (settings.retina && dpr > 1) {
        ctx.scale(dpr, dpr);
    }

    return { canvas, ctx };
}

/**
 * Визуализация игровой плитки
 */
// function gameTileRender (coordinateX, coordinateY, size, ctx, number, bgColor, radius) {
//     // Защита от некорректных значений радиуса (например, если он больше половины стороны)
//     const safeRadius = Math.min(radius, size / 2);

//     ctx.beginPath();
    
//     ctx.moveTo(coordinateX + safeRadius, coordinateY); // Начинаем с верхней грани, отступив слева на радиус
//     ctx.lineTo(coordinateX + size - safeRadius, coordinateY); // Верхняя грань до начала правого верхнего угла
//     ctx.quadraticCurveTo(coordinateX + size, coordinateY, coordinateX + size, coordinateY + safeRadius); // Правый верхний угол
//     ctx.lineTo(coordinateX + size, coordinateY + size - safeRadius); // Правая грань до начала нижнего правого угла
//     ctx.quadraticCurveTo(coordinateX + size, coordinateY + size, coordinateX + size - safeRadius, coordinateY + size); // Нижний правый угол
//     ctx.lineTo(coordinateX + safeRadius, coordinateY + size); // Нижняя грань до левого нижнего угла
//     ctx.quadraticCurveTo(coordinateX, coordinateY + size, coordinateX, coordinateY + size - safeRadius); // Нижний левый угол
//     ctx.lineTo(coordinateX, coordinateY + safeRadius); // Левая грань до верхнего левого угла
//     ctx.quadraticCurveTo(coordinateX, coordinateY, coordinateX + safeRadius, coordinateY); // Замыкание контура (левый верхний угол)
//     ctx.closePath();

//     // Заливаем цветом
//     ctx.fillStyle = bgColor;
//     ctx.fill();

// }

function gameTileRender(coordinateX, coordinateY, size, ctx, number, bgColor, radius, padding = 0) {
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
    // Если вам нужна просто плитка без визуального отступа, замените цвет на bgColor здесь и удалите второй блок fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; 
    drawRoundedRect(ctx, coordinateX, coordinateY, size, safeRadiusFull);
    ctx.fill();

    // 2. Рисуем основную плитку поверх рамки со смещением
    ctx.fillStyle = bgColor;
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

// Вспомогательная функция рисования закругленного прямоугольника (DRY — чтобы не дублировать путь дважды)
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

export { gameFildRender, gameTileRender };













