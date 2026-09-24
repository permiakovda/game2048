// импорт цветов из файла config.css
const twoTitleBG = getComputedStyle(document.documentElement).getPropertyValue('--colors-twoTitleBG');

import { gameFildRender, gameTileRender } from "./visualRender.js";

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    const context2d = gameFildRender({
      width: 400,      
      height: 400,     
      id: 'game-canvas',
      parent: document.querySelector('.main'),
      retina: false
    });

    const tileSize = 40;

    gameTileRender(0, 0, tileSize, context2d.ctx, 2, twoTitleBG, 5)



});