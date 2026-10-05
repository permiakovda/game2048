// импорт настроичных данных из файла config.css
const fieldWidth = getComputedStyle(document.documentElement).getPropertyValue('--game-fieldWidth');
const fieldHeight = getComputedStyle(document.documentElement).getPropertyValue('--game-fieldHeight');
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--game-rows'));
const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--game-cols'));

// импорт модулей игры
import { gameFieldRender, gameTileRender, gameFieldClear } from "./visualRender.js";
import { GameCore } from './GameObjects.js';

document.addEventListener("DOMContentLoaded", (event) => {
  //отрисовка холста для игры
  const context2d = gameFieldRender({
    width: fieldWidth,
    height: fieldHeight,
    id: 'game-canvas',
    parent: document.querySelector('.main'),
  });

  // подготовка игрового поля
  const gameCore = new GameCore(rows, cols, context2d.canvas, gameTileRender, gameFieldClear);
});