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
export class GameField extends GameObject {
  constructor(rows, cols) {
    super();
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) {
      throw new Error('Размеры поля должны быть положительными целыми числами.');
    }
    this.rows = rows;
    this.cols = cols;

    this.matrix = this.createMatrix(rows, cols, 0);
  }

  // матрица игрового поля
  createMatrix(rows, cols, value = 0) {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => value));
  }

  // Проверка выхода координат за границы поля
  isValidCoords(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  // Установка значения в конкретную ячейку
  setCell(row, col, value) {
    if (!this.isValidCoords(row, col)) {
      console.error(`Ошибка: координаты [${row}, ${col}] выходят за пределы поля.`);
      return false;
    }
    this.matrix[row][col] = value;
    return true;
  }

  // Получение значения из конкретной ячейки
  getCell(row, col) {
    if (!this.isValidCoords(row, col)) {
      return undefined;
    }
    return this.matrix[row][col];
  }

  // Очистка всего поля до базового значения
  clear(value = 0) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.matrix[r][c] = value;
      }
    }
  }

  //отрисовка игрового поля
  render(renderer) {
    if (typeof renderer !== 'function') return;

    for (let r = 0; r < this.rows; r++) {
      // Можно передавать целую строку для пакетной отрисовки
      const rowData = this.matrix[r];
      renderer(rowData, r);
    }
  }
}

// класс игровой плитки
export class GameTile extends GameObject {
  //принимает число на плитке и её координату
  constructor(number, coordinateX, coordinateY, size) {
    super();
    this.number = number;             //число на плитке
    this.coordinateX = coordinateX;   //координата x
    this.coordinateY = coordinateY;   //координата y
    this.size = size;                 //размер квадратной плитки
  }

}















