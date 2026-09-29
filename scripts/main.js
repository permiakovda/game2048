// импорт настроичных данных из файла config.css
const titleRadius = getComputedStyle(document.documentElement).getPropertyValue('--border-radius').replace("px", "");
const twoTitleBG = getComputedStyle(document.documentElement).getPropertyValue('--colors-twoTitleBG');
const fieldWhidth = getComputedStyle(document.documentElement).getPropertyValue('--game-fieldWhidth');
const fieldHeight = getComputedStyle(document.documentElement).getPropertyValue('--game-fieldHeight');
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--game-rows'));
const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--game-cols'));

// импорт модулей игры
import { gameFildRender, gameTileRender } from "./visualRender.js";
import { GameField, GameCore } from './GameObjects.js';

document.addEventListener("DOMContentLoaded", (event) => {
  //отрисовка холста для игры
  const context2d = gameFildRender({
    width: fieldWhidth,
    height: fieldHeight,
    id: 'game-canvas',
    parent: document.querySelector('.main'),
  });

  // подготовка размеров одной плитки
  const tileSize = fieldWhidth / rows;

  // подготовка игрового поля
  const gameCore = new GameCore(rows, cols, tileSize, context2d.ctx, gameTileRender);

  




});