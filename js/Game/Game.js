import Card from "./Card.js";
import Pokemon from "./Pokemon.js";

export default class Game {
  constructor(pokeApi, cache, numberOfPairs, renderRoot) {
    this.pokeApi = pokeApi;
    this.cache = cache;
    this.numberOfPairs = numberOfPairs;
    this.renderRoot = renderRoot;
    this.currentFlippedCards = [];
    this.allCards = [];
    this.cardsAreLocked = false;
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

      const cardElement = Card.createFromPokemon(pokemon).getElement();

      const cardElementOne = cardElement.cloneNode(true);
      const cardElementTwo = cardElement.cloneNode(true);
      this.renderRoot.append(cardElementOne);
      this.renderRoot.append(cardElementTwo);
      // Keep track of all the cards to easily lock and release them.
      this.allCards.push(cardElementOne);
      this.allCards.push(cardElementTwo);

      cardElementOne.addEventListener("click", (event) => {
        this._cardWasClicked(event.target);
      });
      cardElementTwo.addEventListener("click", (event) => {
        this._cardWasClicked(event.target);
      });
    });

    // @TODO: Show the cards at first, then flip them over and shuffle them.

    this._hideLoader();
  }

  async _cardWasClicked(cardElement) {
    if (this.cardsAreLocked) {
      return;
    }

    // Lock all cards to prevent abundance of clicking.
    this._lockAllCards();

    cardElement = cardElement.closest("flippable-card");
    if (cardElement.hasAttribute("paired")) {
      // A paired card wal clicked, release cards and early return.
      this._releaseAllCards();
      return;
    }

    // Check if the card that has been clicked, was clicked before.
    // If so, we need to remove it from the currentFlippedCards,
    // as the user is flipping it over again.
    const lenthCurrentFlippedCards = this.currentFlippedCards.length;
    this.currentFlippedCards = this.currentFlippedCards.filter(
      (otherCard) => !cardElement.isSameNode(otherCard)
    );

    if (lenthCurrentFlippedCards !== this.currentFlippedCards.length) {
      // We know user clicked same card again, early return.
      this._releaseAllCards();
      return;
    }

    this.currentFlippedCards.push(cardElement);

    if (this.currentFlippedCards.length == 2) {
      const [a, b] = this.currentFlippedCards;
      this.currentFlippedCards = [];

      if (a.isEqualNode(b)) {
        this._cardsWerePaired(a, b);
        // @TODO: Check if this was the last pair,
        // If so, the game is finished.
        this._releaseAllCards();
        return;
      }

      await this._cardsWereNotPaired(a, b);
    }

    this._releaseAllCards();
  }

  _cardsWerePaired(...cardElements) {
    cardElements.forEach((cardElement) => {
      cardElement.setAttribute("paired", "");
      cardElement.setAttribute("disabled", "");
    });
  }

  async _cardsWereNotPaired(...cardElements) {
    await this._sleep(3);

    cardElements.forEach((cardElement) => {
      cardElement.setAttribute("flipped", "");
    });
  }

  _lockAllCards() {
    this.cardsAreLocked = true;
    this.allCards.forEach((cardElement) => {
      cardElement.setAttribute("disabled", "");
    });
  }

  _releaseAllCards() {
    this.cardsAreLocked = false;
    this.allCards
      .filter((cardElement) => !cardElement.hasAttribute("paired"))
      .forEach((cardElement) => cardElement.removeAttribute("disabled", ""));
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

  _sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
