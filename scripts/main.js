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
      width: fieldWhidth,      
      height: fieldHeight,     
      id: 'game-canvas',
      parent: document.querySelector('.main'),
    });

    // подготовка размеров одной плитки
    const tileSize = fieldWhidth / rows;

    // подготовка игрового поля
    const gameField = new GameField(4, 4, tileSize);

    

    gameField.setCell(1, 2, new GameTile(2, 1, 2, 100));

    // черновой вариант отрисовки нового состояния игры
    for (let i = 0; i < gameField.matrix.length; i++) { 
      for (let j = 0; j < gameField.matrix[i].length; j++) { 
        if (gameField.matrix[i][j] !== 0){
          gameTileRender(
            gameField.matrix[i][j].coordinateX * tileSize, 
            gameField.matrix[i][j].coordinateY * tileSize, 
            tileSize, 
            context2d.ctx, 
            gameField.matrix[i][j].number, 
            twoTitleBG, 
            titleRadius);
        }
    }
  }
    

    



});