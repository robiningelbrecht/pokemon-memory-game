import Pokemon from "./Pokemon.js";

export default class Game {
  constructor(pokeApi, cache, numberOfPairs, renderRoot) {
    this.pokeApi = pokeApi;
    this.cache = cache;
    this.numberOfPairs = numberOfPairs;
    this.renderRoot = renderRoot;
    this.currentFlippedCards = [];
  }

  async render() {
    this._showLoader();
    await this._retrieveAndCacheData();

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

      const cardElementOne = cardElement.cloneNode(true);
      const cardElementTwo = cardElement.cloneNode(true);
      this.renderRoot.append(cardElementOne);
      this.renderRoot.append(cardElementTwo);

      cardElementOne.addEventListener("click", (event) => {
        this._cardWasFlipped(event.target);
      });
      cardElementTwo.addEventListener("click", (event) => {
        this._cardWasFlipped(event.target);
      });
    });

    this._hideLoader();
  }

  _cardWasFlipped(cardElement) {
    this.currentFlippedCards.push(cardElement.closest('flippable-card'));

    if (this.currentFlippedCards.length == 2) {
      const [a, b] = this.currentFlippedCards;
      a.isEqualNode(b);
    }
  }

  _showLoader() {
    document.querySelector("body").classList.add("loading");
  }

  _hideLoader() {
    document.querySelector("body").classList.remove("loading");
  }

  async _retrieveAndCacheData() {
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
