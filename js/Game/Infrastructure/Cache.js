import Pokemon from "../Pokemon.js";

const CACHE_KEY = 'pokemons';
export default class Cache {
  static getPokemon(id) {
    const cache = Cache.__get();

    if (cache.hasOwnProperty(id)) {
      return Pokemon.createFromCache(cache[id]);
    }

    return null;
  }

  static addPokemon(id, data) {
    const cache = Cache.__get();
    cache[id] = data;
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }

  static isWarmedUp() {
    return window.localStorage.getItem(CACHE_KEY);
  }

  static clear() {
    window.localStorage.clear();
  }

  static __get() {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY)) || {};
  }
}
