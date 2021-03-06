import ArrayTransform from "../Infrastructure/Array/ArrayTransform.js";
import Cache from "../Infrastructure/Cache.js";
import Card from "./../Card.js";
import EventDispatcher from "../Infrastructure/EventDispatcher.js";
import Game from "./../Game.js";

export default class CardsScreen {
  constructor(settings) {
    this.settings = settings;
    this.currentFlippedCards = [];
    this.allCards = [];
    this.cardsAreLocked = false;
    this.numberOfMoves = 0;
    this.startedAt = Date.now();
  }

  load(parentElement) {
    const pokemonIndexes = this.settings.getGeneration().getPokemonIndexes();
    ArrayTransform.shuffle(pokemonIndexes);
    const randomPokemonIds = pokemonIndexes.slice(
      0,
      this.settings.getNumberOfPairs()
    );

    randomPokemonIds.forEach((pokemonId) => {
      const pokemon = Cache.getPokemon(pokemonId);
      const cardElement = Card.createFromPokemon(pokemon).getElement();

      const cardElementOne = cardElement.cloneNode(true);
      const cardElementTwo = cardElement.cloneNode(true);

      // Keep track of all the cards to easily lock and release them.
      this.allCards.push(cardElementOne, cardElementTwo);
    });

    // Shuffle cards and add them to the screen.
    parentElement.append(...ArrayTransform.shuffle(this.allCards));

    // Bind click event to all cards.
    document.querySelectorAll("flippable-card").forEach((element) => {
      element.addEventListener("click", (event) => {
        this._cardWasClicked(event.target);
      });
    });
  }

  async _cardWasClicked(cardElement) {
    if (this.cardsAreLocked) {
      return;
    }

    // Lock all cards to prevent abundance of clicking.
    this._lockAllCards();

    this.numberOfMoves++;

    cardElement = cardElement.closest("flippable-card");
    if (cardElement.hasAttribute("paired")) {
      // A paired card was clicked, release cards and early return.
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
        this._releaseAllCards();

        if (this._allCardsWerePaired()) {
          setTimeout(() => {
            EventDispatcher.dispatch(
              new CustomEvent("gameWasCompleted", {
                detail: {
                  numberOfMoves: this.numberOfMoves,
                  timeToComplete: Date.now() - this.startedAt,
                },
              })
            );
          }, 2000);
        }
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

    setTimeout(() => {
      cardElements.forEach((cardElement) => {
        cardElement.setAttribute("paired-visually", "");
      });
    }, 1000);
  }

  async _cardsWereNotPaired(...cardElements) {
    await Game._sleep(1.5);

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

  _allCardsWerePaired() {
    return (
      this.allCards.filter((cardElement) => !cardElement.hasAttribute("paired"))
        .length === 0
    );
  }
}
