// вероятность выпадения случайного числа для плитки
export function getWeightedNumber() {
  if (Math.random() < 0.9) {
    return 2; 
  } else {
    return 4; 
  }
}

