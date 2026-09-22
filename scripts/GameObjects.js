// общий класс для всех игровых сущностей
class GameObject {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.isAlive = true;
    }

   // Метод, который обязаны переопределить дети
    update(deltaTime) { 
    if (new.target === GameObject) { 
        throw new Error("Method 'update' must be implemented in subclass"); } 
    }

    render(context) {
         // Общая логика отрисовки (например, рамка хитбокса) 
         context.strokeStyle = 'red'; 
         context.strokeRect(this.x, this.y, this.width, this.height); 
    }

    destroy() { 
        this.isAlive = false; 
    }
}

// класс игрового поля
class GameFild extends GameObject {
  constructor(height, width) {
    super(height, width); 
  }

  speak() {
    console.log(`${this.name} лает.`);
  }
}
