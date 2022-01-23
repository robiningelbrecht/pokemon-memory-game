import ArrayTransform from "../Infrastructure/Array/ArrayTransform.js";

export default class Generation {
  constructor(id, mainRegion, pokemonIndexes) {
    this._id = id;
    this._mainRegion = mainRegion;
    this._pokemonIdexes = pokemonIndexes;
  }

  getId() {
    return this._id;
  }

  getMainRegion() {
    return this._mainRegion.charAt(0).toUpperCase() + this._mainRegion.slice(1);
  }

  getPokemonIndexes() {
    return this._pokemonIdexes;
  }

  static createFromApi(apiGeneration) {
    // So we need to do some dirty black magic here to determine pokemon indexes in this generation.
    const pokemonIndexes = ArrayTransform.sort(apiGeneration.pokemon_species.map((pokemon) =>
      parseInt(pokemon.url.replace("v2", "").match(/\d+/)[0])
    ));

    return new Generation(
      apiGeneration.id,
      apiGeneration.main_region.name,
      pokemonIndexes,
    );
  }

  static createFromCache(data) {
    return new Generation(
      data._id,
      data._mainRegion,
      data._pokemonIdexes
    );
  }
}
