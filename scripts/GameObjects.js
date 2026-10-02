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
  setCell(row, col, number) {
    if (!this.isValidCoords(row, col)) {
      return false; // выход за гранцы игрового поля
    }
    this.matrix[row][col] = number;
    return true;
  }

  // Получение значения из конкретной ячейки
  getCell(row, col) {
    if (!this.isValidCoords(row, col)) {
      return undefined;
    }
    return this.matrix[row][col];
  }

  // Получить копию матрицы (полная копия без ссылок на исходные данные)
  getMatrixCopy() {
    return JSON.parse(JSON.stringify(this.matrix))
  }

  // Очистка всего поля до базового значения
  clear(value = 0) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.setCell(r, c, value);
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

    // Если пустых ячеек нет 
    if (emptyTiles.length === 0) {
      return null;
    }

    // 2. Выбираем случайную ячейку из списка
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const [row, col] = emptyTiles[randomIndex];

    // 3. Заполняем её плиткой
    this.setCell(row, col, this._getTileNumber())
  }

  _getTileNumber() {
    if (Math.random() < 0.9) {
      return 2;
    } else {
      return 4;
    }
  }

  move(key) {
    const matrixBeforeMove = this.getMatrixCopy();
    let result = { moved: false, scoreGained: 0 };

    if (key === 'ArrowRight') {
      result = this._slideMatrixRight(this.matrix);
      this.matrix = result.shiftedMatrix;
    } else if (key === 'ArrowDown') {
      result = this._slideMatrixRight(this._rotateMatrix(this.matrix, 'ccw'));
      this.matrix = this._rotateMatrix(result.shiftedMatrix, 'cw');
    } else if (key === 'ArrowLeft') {
      result = this._slideMatrixRight(this._rotateMatrix(this._rotateMatrix(this.matrix, 'ccw'), 'ccw'));
      this.matrix = this._rotateMatrix(this._rotateMatrix(result.shiftedMatrix, 'cw'), 'cw');
    } else if (key === 'ArrowUp') {
      result = this._slideMatrixRight(this._rotateMatrix(this.matrix, 'cw'));
      this.matrix = this._rotateMatrix(result.shiftedMatrix, 'ccw');
    }

    // паттерн для сравнения матриц
    const moved = !(JSON.stringify(this.matrix) === JSON.stringify(matrixBeforeMove));

    return { moved: moved, scoreGained: result.scoreGained };
  }

  // внутренний метод смещения и слияния игровой матрицы вправо
  _slideMatrixRight(matrix) {
    const shiftedMatrix = [];
    let scoreGained = 0;

    for (let i = 0; i < matrix.length; i++) {
      const size = matrix[i].length;
      const compact = matrix[i].filter(v => v !== 0);  // удаление нулей из строки игровой матрицы
      const merged = [];

      // идём СПРАВА налево, чтобы сливать крайние правые пары
      for (let j = compact.length - 1; j >= 0; j--) {
        if (j > 0 && compact[j] === compact[j - 1]) {
          const newNumber = compact[j] * 2;
          merged.unshift(newNumber);
          scoreGained += newNumber;
          j--;  // пропускаем уже слитую пару
        } else {
          merged.unshift(compact[j]);
        }
      }
      while (merged.length < size) merged.unshift(0);  // добавить нули для слитой строки слева

      shiftedMatrix[i] = merged;
    }

    return { shiftedMatrix, scoreGained };
  }

  // паттерн поворот игровой матрицы почасовой и против часовой стрелки
  // rotate(matrix, 'cw')  — по часовой
  // rotate(matrix, 'ccw') — против часовой
  _rotateMatrix(matrix, direction = 'cw') {
    if (!matrix.length) return [];

    const rows = matrix.length;
    const cols = matrix[0].length;

    const result = Array.from({ length: cols }, () => Array(rows));

    // Преобразуем строковый аргумент в числовой множитель
    const k = direction === 'ccw' ? -1 : 1;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (k === 1) {
          // По часовой стрелке: [i][j] -> [j][rows - 1 - i]
          result[j][rows - 1 - i] = matrix[i][j];
        } else {
          // Против часовой стрелки: [i][j] -> [cols - 1 - j][i]
          result[cols - 1 - j][i] = matrix[i][j];
        }
      }
    }
    return result;
  }

  // проверка наличия плитки с нужной цифрой (для проверки победы 2048)
  hasTile(number) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.getCell(r, c) === number) {
          return true;
        }
      }
    }

    return false;
  }

  // проверка на возможность нового хода (есть хотябы одна пусая клетка или соседние питки можно объеденить)
  hasAvailableMoves() {

    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === 0) {
          return true;
        }
      }
    }

    // проверка на наличия пары по горизонтали
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols - 1; c++) {
        if (this.matrix[r][c] === this.matrix[r][c + 1]) {
          return true;
        }
      }
    }

    // проверка на наличия пары по вертикали
    for (let r = 0; r < this.rows - 1; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.matrix[r][c] === this.matrix[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

// класс игрового ядра
export class GameCore extends GameObject {
  constructor(rows, cols, canvas, tileRenderFunction, fieldClearFunction) {
    super();                         // размер плитки
    this.field = new GameField(rows, cols);             // создание игрового поля
    this.canvas = canvas;                               // ссылка на канвас
    this.ctx = this.canvas.getContext('2d');            // ссылка на контекст для рисования
    this.tileRenderFunction = tileRenderFunction;       // функция рисования
    this.fieldClearFunction = fieldClearFunction;       // функция чистки канваса
    this.score = 0;                                     // очки
    this.isWaitingInput = true;                         // Флаг состояния (готов к ходу игрока или крутит анимацию / обрабатывает)

    this._setupInput();                                 // Подписываемся на клавиши
    this._startNewGame();                               // Инициализация
  }

  _startNewGame() {
    this.score = 0;
    this.field.clear(0);

    this.field.spawnRandomTile();
    this.field.spawnRandomTile();
    this._render();
  }

  _setupInput() {
    // Используем один обработчик на все нажатия
    window.addEventListener('keydown', (e) => this._onKeyPress(e));
  }

  _onKeyPress(e) {
    // 1. Проверка: свободна ли игра и нажата ли стрелка
    if (!this.isWaitingInput || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return;
    }

    e.preventDefault(); // Блокируем прокрутку страницы

    // 2. Блокируем ввод на время хода
    this.isWaitingInput = false;

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
    this.fieldClearFunction(this.canvas);

    for (let i = 0; i < this.field.matrix.length; i++) {
      for (let j = 0; j < this.field.matrix[i].length; j++) {
        if (this.field.matrix[i][j] !== 0) {

          this.tileRenderFunction(
            i,
            j,
            this.ctx,
            this.field.matrix[i][j],
          );
        }
      }
    }
  }
}













