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
  // конструктор принимает размер игрового поля
  constructor(rows, cols) {
    super();
    this.rows = rows;
    this.cols = cols;
  }

  // паттерн создания матрицы для игрового поля
  createMatrix(rows, cols, value = 0) {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => value));
  }
}

// класс игровой плитки
class GameTile extends GameObject {
  //принимает число на плитке и её координату
  constructor(number, coordinateX, coordinateY, size, ctx) {
    super();
    this.number = number;             //число на плитке
    this.coordinateX = coordinateX;   //координата x
    this.coordinateY = coordinateY;   //координата y
    this.size = size;                 //размер квадратной плитки
    this.ctx = ctx;                   //ссылка на 2д-контекст для рисования в canvas
  }

}