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
    while (randomPokemonIds.size !== this.numberOfPairs) {
      randomPokemonIds.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    [...randomPokemonIds].forEach((pokemonId) => {
      const pokemon = this.cache.getPokemon(pokemonId);

      const cardElement = document.createElement("flippable-card");
      cardElement.classList.add(...["type", "type--" + pokemon.getTypes()[0]]);
      //cardElement.setAttribute('flipped', '');

      cardElement.innerHTML =
        '<div slot="front"><img src="' +
        pokemon.getSprite() +
        '" /><p>#' +
        pokemon.getId() +
        " " +
        pokemon.getName() +
        '</p></div><div slot="back"><img src="assets/pokeball.png" /></div>';

      this.renderRoot.append(cardElement.cloneNode(true));
      this.renderRoot.append(cardElement.cloneNode(true));
    });
  }

  updateFlippedCards() {}

  updateFoundPairs() {}

  async retrieveAndCacheData() {
    if (this.cache.isWarmedUp()) {
      return;
    }

    for (let id = 1; id <= 151; id++) {
      const apiPokemon = await this.pokeApi.getPokemon(id);

      const pokemon = Pokemon.createFromApi(apiPokemon);
      this.cache.addPokemon(id, pokemon);
    }
  }
}
