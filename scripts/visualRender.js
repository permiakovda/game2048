// модуль визуализации и рендера игрового поял и игровых плиток

/**
 * Создает HTML-элемент <canvas> и добавляет его в DOM.
 *
 * @param {Object} options - Настройки холста.
 * @param {number} [options.width=800] - Ширина холста в пикселях.
 * @param {number} [options.height=600] - Высота холста в пикселях.
 * @param {string} [options.id='game-canvas'] - ID элемента (нужен для стилей CSS).
 * @param {HTMLElement|string} [options.parent=document.body] - Родительский узел или его селектор.
 * @returns {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }} Объект с холстом и 2D-контекстом.
 */
function gameFildRender (options = {}) {
    const settings = {
        width: 400,
        height: 400,
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
function gameTileRender(coordinateX, coordinateY, size, ctx, number = 2, bgColor, radius = 0, padding = 0) {
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




export { gameFildRender, gameTileRender };