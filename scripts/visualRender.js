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




export { gameFildRender };