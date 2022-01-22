import Pokemon from "./Pokemon.js";
import Cache from "./Cache.js";
import PokeApi from "./PokeApi.js";
import CardsScreen from "./Screen/CardsScreen.js";

export default class Game {
  constructor(settings, rootElement) {
    this.settings = settings;
    this.pokeApi = new PokeApi(); 
    this.rootElement = rootElement;
  }

  async start() {
    this._showLoader();

    await this._retrieveAndCacheData();

    const cardsScreen = new CardsScreen(this.settings);
    cardsScreen.load(this.rootElement);

    this._hideLoader();
  }

  _showLoader() {
    document.querySelector("body").classList.add("loading");
  }

  _hideLoader() {
    document.querySelector("body").classList.remove("loading");
  }

  async _retrieveAndCacheData() {
    if (Cache.isWarmedUp()) {
      return;
    }

    for (let id = 1; id <= 151; id++) {
      const apiPokemon = await this.pokeApi.getPokemon(id);

      const pokemon = Pokemon.createFromApi(apiPokemon);
      Cache.addPokemon(id, pokemon);
    }
  }

  static _sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
