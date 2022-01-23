const BASE_URI = "https://pokeapi.co/api/v2";
export default class PokeApi {
  static async request(path) {
    let response = await fetch(BASE_URI + path);
    return await response.json();
  }

  static async getGenerations() {
    const response = await this.request("/generation");
    return response.results;
  }

  static async getGeneration(identifier) {
    return await this.request("/generation/" + identifier);
  }

  static async getPokemon(identifier) {
    return await this.request("/pokemon/" + identifier);
  }

  static async gePokemonList(limit) {
    return await this.request("/pokemon?limit=" + limit);
  }

  static async getSpecies(identifier) {
    return await this.request("/pokemon-species/" + identifier);
  }
}
