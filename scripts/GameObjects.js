// общий класс для всех игровых сущностей
class GameObject {
    constructor() {
        this.isAlive = true;
    }

    destroy() { 
        this.isAlive = false; 
    }
}

// класс игрового поля
class GameFild extends GameObject {
  constructor(rows, cols) {
    super(); 
  }

  // паттерн создания матрицы для игрового поля
  createMatrix(rows, cols, value = 0) {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => value));
  }
}

// класс игровой плитки
class GameTile extends GameObject {
  constructor(number) {
    super(height, width); 
  }

  speak() {
    console.log(`${this.name} лает.`);
  }
}