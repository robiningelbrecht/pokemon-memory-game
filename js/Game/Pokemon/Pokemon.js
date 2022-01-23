export default class Pokemon {
  constructor(
    id,
    name,
    baseExperience,
    height,
    weight,
    abilities,
    moves,
    types,
    stats,
    sprite
  ) {
    this._id = id;
    this._name = name;
    this._baseExperience = baseExperience;
    this._height = height;
    this._weight = weight;
    this._abilities = abilities;
    this._moves = moves;
    this._types = types;
    this._stats = stats;
    this._sprite = sprite;
  }

  getId() {
    return this._id;
  }

  getName() {
    return this._name;
  }

  getBaseExperience() {
    return this._baseExperience;
  }

  getHeight() {
    return this._height;
  }

  getWeight() {
    return this._weight;
  }

  getAbilities() {
    return this._abilities;
  }

  getMoves() {
    return this._moves;
  }

  getTypes() {
    return this._types;
  }

  getStats() {
    return this._stats;
  }

  getSprite() {
    return this._sprite;
  }

  static createFromApi(apiPokemon) {
    return new Pokemon(
      apiPokemon.id,
      apiPokemon.name,
      apiPokemon.base_experience,
      apiPokemon.height,
      apiPokemon.weight,
      apiPokemon.abilities.map((ability) => {
        return ability.ability.name;
      }),
      apiPokemon.moves.map((move) => {
        return move.move.name;
      }),
      apiPokemon.types.map((type) => {
        return type.type.name;
      }),
      apiPokemon.stats.map((stat) => {
        return {
          name: stat.stat.name,
          base_stat: stat.base_stat,
        };
      }),
      apiPokemon.sprites.other.dream_world.front_default ||
      apiPokemon.sprites.other["official-artwork"].front_default
    );
  }

  static createFromCache(data) {
    return new Pokemon(
      data._id,
      data._name,
      data._baseExperience,
      data._height,
      data._weight,
      data._abilities,
      data._moves,
      data._types,
      data._stats,
      data._sprite
    );
  }
}
