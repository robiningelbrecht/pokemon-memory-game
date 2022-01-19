import Pokemon from "./Pokemon.js";

export default class Game {
  constructor(pokeApi, cache, numberOfPairs, renderRoot) {
    this.pokeApi = pokeApi;
    this.cache = cache;
    this.numberOfPairs = numberOfPairs;
    this.renderRoot = renderRoot;
  }

  render() {
      const min = 1;
      const max = 151;

      const randomPokemonIds = new Set();
      while(randomPokemonIds.size !== this.numberOfPairs) {
        randomPokemonIds.add(Math.floor(Math.random() * (max - min + 1)) + min);
      }

      [...randomPokemonIds].forEach(pokemonId => {
          const pokemon = this.cache.getPokemon(pokemonId);

          const cardElement = document.createElement('flippable-card');
          cardElement.dataset.pokemonId = pokemonId;
          cardElement.classList.add(pokemon.getColor());

          cardElement.innerHTML = '<div slot="front"><img src="'+ pokemon.getSprite() +'" /><p>' + pokemon.getName() +'</p></div><div slot="back"></div>';

          this.renderRoot.append(cardElement.cloneNode(true));
          this.renderRoot.append(cardElement.cloneNode(true));
      });
  }

  async retrieveAndCacheData() {
    if (this.cache.isWarmedUp()) {
      return;
    }

    for (let id = 1; id <= 151; id++) {
      const apiPokemon = await this.pokeApi.getPokemon(id);
      const apiSpecies = await this.pokeApi.getSpecies(id);

      const pokemon = Pokemon.createFromApi(apiPokemon, apiSpecies);
      this.cache.addPokemon(id, pokemon);
    }
  }

  _getPokedexHexColor(color) {
    const colors = new Map([
      ["black", "#111111"],
      ["blue", "#2196F3"],
      ["brown", "#A1887F"],
      ["gray", "#BBBBBB"],
      ["green", "#4CAF50"],
      ["pink", "#E91E63"],
      ["purple", "#9C27B0"],
      ["red", "#F44336"],
      ["white", "#FFFFFF"],
      ["yellow", "#FFC107"],
    ]);

    return colors.get(color);
  }
}
