// модуль визуализации и рендера игрового поял и игровых плиток

// импорт настроек из файла config.css
const borderRadius = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-radius')) || 0;
const paddingTitle = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--padding-title')) || 0;
const fieldWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-fieldWidth')) || 400;
const fieldHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-fieldHeight')) || 400;
const fieldCols = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--game-cols')) || 4;

// загрузка доступных цветов
let TILE_COLORS = null;

/**
 * загрузка цвета для игры из настроичного файла
 */
function loadTileColors() {
    const cs = getComputedStyle(document.documentElement);
    const get = (name) => cs.getPropertyValue(name).trim();
    TILE_COLORS = {
        2: get('--colors-TitleBG_2'),
        4: get('--colors-TitleBG_4'),
        8: get('--colors-TitleBG_8'),
        16: get('--colors-TitleBG_16'),
        32: get('--colors-TitleBG_32'),
        64: get('--colors-TitleBG_64'),
        128: get('--colors-TitleBG_128'),
        256: get('--colors-TitleBG_256'),
        512: get('--colors-TitleBG_512'),
        1024: get('--colors-TitleBG_1024'),
        2048: get('--colors-TitleBG_2048'),
    };
}

/**
 * выбор цвета заднего фона игрововй плитки, для этого числа подбирается соответствующий цвет заднего фона
 *
 * @param {number} number - число на игровой плитке 
 */
function tileColorSetBG(number) {
    if (!TILE_COLORS) loadTileColors();
    return TILE_COLORS[number] ?? TILE_COLORS[2048];
}

/**
 * рисование закругленного прямоугольника
 *
 * @param {number} ctx - ширина холста (px)
 * @param {number} x - коорлиниата x (верхний левый угол игрововй плитки)
 * @param {number} y - коорлиниата y (верхний левый угол игрововй плитки)
 * @param {number} side - ширина игрововй плитки
 * @param {number} r - радиус скругления (px)
 */
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

/**
 * расчет размеров игровой плитки
 *
 * @param {number} whidth - ширина холста (px)
 * @param {number} cols - количество столбцов в игре (челое число)
 */
function getTileSize(whidth = fieldWidth, cols = fieldCols){
    return whidth / cols;
}

/**
 * Создает HTML-элемент <canvas> и добавляет его в DOM.
 *
 * @param {Object} options - Настройки холста.
 * @param {number} options.width - Ширина холста в пикселях.
 * @param {number} options.height - Высота холста в пикселях.
 * @param {string} [options.id='game-canvas'] - ID элемента (нужен для стилей CSS).
 * @param {HTMLElement|string} [options.parent=document.body] - Родительский узел или его селектор.
 * @returns {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }} Объект с холстом и 2D-контекстом.
 */
function gameFieldRender(options = {}) {
    const settings = {
        width: fieldWidth,
        height: fieldHeight,
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
 * @param {number} row - Координата X в игровой матрице.
 * @param {number} col - Координата Y в игровой матрице.
 * @param {CanvasRenderingContext2D} ctx - 2D контекст рендеринга элемента canvas.
 * @param {string|number|null|undefined} number - Значение (число или строка), которое будет выведено по центру плитки. Если null или undefined — текст не выводится.
 * @param {number} radius - Радиус скругления углов в пикселях. Автоматически ограничивается половиной стороны во избежание артефактов.
 * @param {number} padding - Внутренний отступ между внешней границей и основным фоном в пикселях. 
 *                               Не может быть меньше 0 и больше половины размера плитки. По умолчанию равен 0 (отступ отсутствует).
 */
function gameTileRender(row, col, ctx, number = 2, radius = borderRadius, padding = paddingTitle) {
    const size = getTileSize();
    const coordinateX = col * size;
    const coordinateY = row * size;
    
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

/**
 * Чистка игрового поля
 *
 * @param {HTMLCanvasElement} canvas - ссылка на холст. 
 */
function gameFieldClear(canvas){
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Отрисовывает игровых очков
 *
 * @param {HTMLElement|string} [parent=document.body] - Родительский узел или его селектор.
 */

function gameScoreRender(parent){

}


export { gameFieldRender, gameTileRender, gameFieldClear };
