import { gameFildRender } from "./visualRender.js";

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    const context2d = gameFildRender({
      width: 1000,      
      height: 1000,     
      id: 'game-canvas',
      parent: document.querySelector('.main'),
      retina: false
  });



});