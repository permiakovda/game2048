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
  setCell(tile) {
    if (!this.isValidCoords(tile.coordinateY, tile.coordinateX)) {
      console.error(`Ошибка: координаты [${tile.coordinateY}, ${tile.coordinateX}] выходят за пределы поля.`);
      return false;
    }
    this.matrix[tile.coordinateY][tile.coordinateX] = tile;
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

  // создание плитки в случайном месте
  spawnRandomTile() {
    const emptyTiles = [];

    // 1. Проходим по всему массиву и собираем координаты пустых ячеек
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] == 0) {
          emptyTiles.push([i, j]);
        }
      }
    }

    // Если пустых ячеек нет выбрасываем ошибку
    if (emptyTiles.length === 0) {
      throw new Error('Добовлять новый элемент некуда, возможно - это конец игры.');
    }

    // 2. Выбираем случайную ячейку из списка
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const [row, col] = emptyTiles[randomIndex];

    // 3. Заполняем её плиткой
    this.matrix[row][col] = this._getTileNumber();
  }

  _getTileNumber() {
    if (Math.random() < 0.9) {
      return 2;
    } else {
      return 4;
    }
  }
}

// класс игрового ядра
export class GameCore extends GameObject {
  constructor(rows, cols, tileSize, ctx, tileRenderFunction) {
    super();
    this.tileSize = tileSize;                           // размер плитки
    this.field = new GameField(rows, cols);             // создание игрового поля
    this.ctx = ctx;                                     // ссылка на канвас
    this.tileRenderFunction = tileRenderFunction;       // Сохраняем функцию рисования
    this.score = 0;                                     // очкиы
    this.isWaitingInput = true;                         // Флаг состояния (готов к ходу игрока или крутит анимацию / обрабатывает)

    this._setupInput();                                 // Подписываемся на клавиши
    this._startNewGame();                               // Инициализация
  }

  _setupInput() {
    // Используем один обработчик на все нажатия
    window.addEventListener('keydown', (e) => this._onKeyPress(e));
  }

  _startNewGame() {
    this.score = 0;
    this.field.clear(0); // Очищаем поле (0 - пустая клетка)
    // Добавляем 2 случайных цифры для старта
    this.field.spawnRandomTile();
    this.field.spawnRandomTile();
    this._render(); // Отрисовываем начальное состояние
  }

  _onKeyPress(e) {
    // 1. Проверка: свободна ли игра и нажата ли стрелка
    if (!this.isWaitingInput || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return;
    }

    e.preventDefault(); // Блокируем прокрутку страницы

    // 2. Блокируем ввод на время хода
    this.isWaitingInput = false;

    // 3. Сохраняем состояние ДО хода для проверки изменений
    const previousState = this.field.getMatrixCopy();

    // 4. Выполняем логику сдвига в классе GameField
    const moveResult = this.field.move(e.key);

    if (moveResult.moved) {
      // 5. Если поле изменилось: обновляем счет
      this.score += moveResult.scoreGained;

      // 6. Добавляем новый тайл (это делает поле, но триггерит Game)
      this.field.spawnRandomTile();

      // 7. Проверка условий завершения
      if (this._checkGameOver()) {
        console.log('Игра окончена!');
        return;
      }
    }

    // 8. Разрешаем новый ход. 
    // В реальной игре здесь должна быть задержка на анимацию (setTimeout)
    this.isWaitingInput = true;

    // 9. Перерисовка UI
    this._render();
  }

  _checkGameOver() {
    // Проверка на 2048 (победа) или отсутствие возможных ходов
    return this.field.hasTile(2048) || !this.field.hasAvailableMoves();
  }

  _render() {
    console.log(this.field.matrix)

    // черновой вариант отрисовки нового состояния игры
    for (let i = 0; i < this.field.matrix.length; i++) {
      for (let j = 0; j < this.field.matrix[i].length; j++) {
        if (this.field.matrix[i][j] !== 0) {

          this.tileRenderFunction(
            i * this.tileSize,
            j * this.tileSize,
            this.tileSize,
            this.ctx,
            this.field.matrix[i][j],

          );
        }
      }
    }
  }
}













