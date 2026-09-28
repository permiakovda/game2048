// импорт настроичных данных из файла config.css
const titleRadius = getComputedStyle(document.documentElement).getPropertyValue('--border-radius').replace("px", "");
const twoTitleBG = getComputedStyle(document.documentElement).getPropertyValue('--colors-twoTitleBG');
const fieldWhidth = getComputedStyle(document.documentElement).getPropertyValue('--game-fieldWhidth');        
const fieldHeight = getComputedStyle(document.documentElement).getPropertyValue('--game-fieldHeight');         
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--game-rows'));                     
const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--game-cols'));  

// импорт модулей игры
import { gameFildRender, gameTileRender } from "./visualRender.js";
import { GameField, GameTile, GameCore } from './GameObjects.js';

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

    // // подготовка игрового поля
    // const gameField = new GameField(4, 4, tileSize);

    

  //   gameField.setCell(1, 2, new GameTile(2, 1, 2, 100));

  //   // черновой вариант отрисовки нового состояния игры
  //   for (let i = 0; i < gameField.matrix.length; i++) { 
  //     for (let j = 0; j < gameField.matrix[i].length; j++) { 
  //       if (gameField.matrix[i][j] !== 0){
  //         gameTileRender(
  //           gameField.matrix[i][j].coordinateX * tileSize, 
  //           gameField.matrix[i][j].coordinateY * tileSize, 
  //           tileSize, 
  //           context2d.ctx, 
  //           gameField.matrix[i][j].number, 
  //           titleRadius);
  //       }
  //   }
  // }

  // console.log(gameField.matrix)

// --------------------------------------------------------------------------------------

  const gameCore = new GameCore(rows, cols, tileSize);

  

  gameCore._startNewGame();

  // gameCore.field.setCell(new GameTile(2, 1, 2, 100));
  // gameCore.field.setCell(new GameTile(8, 0, 0, 100));
  // gameCore.field.setCell(new GameTile(2, 3, 3, 100));
  console.log(gameCore.field)
    
    // черновой вариант отрисовки нового состояния игры
    for (let i = 0; i < gameCore.field.matrix.length; i++) { 
      for (let j = 0; j < gameCore.field.matrix[i].length; j++) { 
        if (gameCore.field.matrix[i][j] !== 0){
          console.log(gameCore.field.matrix[i][j].coordinateX)
          gameTileRender(
            gameCore.field.matrix[i][j].coordinateX, 
            gameCore.field.matrix[i][j].coordinateY, 
            tileSize, 
            context2d.ctx, 
            gameCore.field.matrix[i][j].number, 
            titleRadius,
          10);
        }
    }
  }
    



});