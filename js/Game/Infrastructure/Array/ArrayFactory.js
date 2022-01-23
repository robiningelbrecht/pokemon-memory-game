export default class ArrayFactory {
    static createIntegerRange(min, size) {
      return Array.from(new Array(size), (x, i) => i + min);
    }
  
    static createWithRandomIntegers(size, min, max) {
      const randomIntegers = new Set();
  
      while (randomIntegers.size !== size) {
        randomIntegers.add(Math.floor(Math.random() * (max - min + 1)) + min);
      }
  
      return [...randomIntegers];
    }
  }
  