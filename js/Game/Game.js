import Pokemon from "./Pokemon.js";
import Cache from "./Cache.js";
import PokeApi from "./PokeApi.js";
import CardsScreen from "./Screen/CardsScreen.js";

export default class Game {
  constructor(settings, renderRoot) {
    this.settings = settings;
    this.cache = new Cache();
    this.pokeApi = new PokeApi(); 
    this.renderRoot = renderRoot;
  }

  async start() {
    this._showLoader();

    await this._retrieveAndCacheData();

    const cardsScreen = new CardsScreen(this.settings);
    
    this._hideLoader();
    this.renderRoot.append(...cardsScreen.getElements());

    // @TODO: Show the cards at first, then flip them over and shuffle them.
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

  static _sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
