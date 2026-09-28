// импорт настроичных данных из файла config.css
const titleRadius = getComputedStyle(document.documentElement).getPropertyValue('--border-radius').replace("px", "");
const twoTitleBG = getComputedStyle(document.documentElement).getPropertyValue('--colors-twoTitleBG');
const fieldWhidth = getComputedStyle(document.documentElement).getPropertyValue('--game-fieldWhidth');        
const fieldHeight = getComputedStyle(document.documentElement).getPropertyValue('--game-fieldHeight');         
const rows = getComputedStyle(document.documentElement).getPropertyValue('--game-rows');                     
const cols = getComputedStyle(document.documentElement).getPropertyValue('--game-cols');  

// импорт модулей игры
import { gameFildRender, gameTileRender } from "./visualRender.js";
import { GameField, GameTile } from './GameObjects.js';

document.addEventListener("DOMContentLoaded", (event) => {
    //отрисовка холста для игры
    const context2d = gameFildRender({
      width: 400,      
      height: 400,     
      id: 'game-canvas',
      parent: document.querySelector('.main'),
    });

    // подготовка игрового поля
    const gameField = new GameField(4, 4);

    // подготовка размеров одной плитки
    const tileSize = fieldWhidth / rows;

    gameField.setCell(1, 2, new GameTile(2, 1, 2, 100));

    console.log(gameField.matrix);

    

    gameTileRender(0, 0, tileSize, context2d.ctx, 2, twoTitleBG, titleRadius, 10)



});