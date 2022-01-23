import Generation from "../Pokemon/Generation.js";
import Pokemon from "../Pokemon/Pokemon.js";

const CACHE_KEY_POKEMONS = "pokemons";
const CACHE_KEY_GENRATIONS = "pokemon_generations";
export default class Cache {
  static getPokemon(id) {
    const cache = Cache.__get(CACHE_KEY_POKEMONS);

    if (cache.hasOwnProperty(id)) {
      return Pokemon.createFromCache(cache[id]);
    }

    return null;
  }

  static getGeneration(id) {
    const cache = Cache.__get(CACHE_KEY_GENRATIONS);

    if (cache.hasOwnProperty(id)) {
      return Generation.createFromCache(cache[id]);
    }

    return null;
  }

  static getGenerations() {
    const generations = [];
    const cache = Cache.__get(CACHE_KEY_GENRATIONS);

    for (const [id, generation] of Object.entries(cache)) {
      generations.push(Generation.createFromCache(generation));
    }

    return generations;
  }

  static addPokemon(id, data) {
    const cache = Cache.__get(CACHE_KEY_POKEMONS);
    cache[id] = data;
    window.localStorage.setItem(CACHE_KEY_POKEMONS, JSON.stringify(cache));
  }

  static addGeneration(id, data) {
    const cache = Cache.__get(CACHE_KEY_GENRATIONS);
    cache[id] = data;
    window.localStorage.setItem(CACHE_KEY_GENRATIONS, JSON.stringify(cache));
  }

  static isWarmedUpForGenerations() {
    return window.localStorage.getItem(CACHE_KEY_GENRATIONS);
  }

  static isWarmedUpForPokemonInGeneration(generation) {
    const cache = Cache.__get(CACHE_KEY_POKEMONS);

    return cache.hasOwnProperty(generation.getPokemonIndexes()[0]);
  }

  static clear() {
    window.localStorage.clear();
  }

  static __get(key) {
    return JSON.parse(window.localStorage.getItem(key)) || {};
  }
}
