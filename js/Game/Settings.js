import ArrayFactory from "./Infrastructure/Array/ArrayFactory.js";
import Generation from "./Pokemon/Generation.js";
export default class Settings {
  constructor(generation, numberOfPairs) {
    this.generation = generation;
    this.numberOfPairs = numberOfPairs;
  }

  getNumberOfPairs() {
    return this.numberOfPairs;
  }

  getGeneration() {
    return this.generation;
  }

  setGeneration(generation) {
    this.generation = generation;
  }

  static default() {
    return new Settings(
      new Generation(1, "Kanto", ArrayFactory.createIntegerRange(1, 151)),
      10
    );
  }
}
