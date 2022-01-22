import Cache from "./Infrastructure/Cache.js";
import CardsScreen from "./Screen/CardsScreen.js";
import EventDispatcher from "./Infrastructure/EventDispatcher.js";
import PokeApi from "./Infrastructure/PokeApi.js";
import Pokemon from "./Pokemon.js";

export default class Game {
  constructor(settings, rootElement) {
    this.settings = settings;
    this.rootElement = rootElement;
    this.pokeApi = new PokeApi();
    this.wrapperElement = document.createElement("div");
    this._bindEventListeners();
  }

  async start() {
    EventDispatcher.dispatch(new Event("gameWasInitialized"));

    await this._retrieveAndCacheData();

    EventDispatcher.dispatch(new Event("gameDataWasLoaded"));
  }

  _bindEventListeners() {
    const body = document.querySelector("body");

    body.addEventListener("gameWasInitialized", () => {
      this._gameWasInitialized();
    });

    body.addEventListener("gameDataWasLoaded", () => {
      this._gameDataWasLoaded();
    });
  }

  _gameWasInitialized() {
    // Game has been initialized.
    // Show loader and build DOM structure.
    this._showLoader();

    this.wrapperElement.classList.add(...["game"]);

    const loaderElement = document.createElement("div");
    loaderElement.innerText = "Loading";
    loaderElement.classList.add(...["loader"]);

    const screenElement = document.createElement("div");
    screenElement.classList.add(...["screen"]);

    this.wrapperElement.append(loaderElement, screenElement);
    this.rootElement.append(this.wrapperElement);
  }

  _gameDataWasLoaded() {
    // Game data has been loaded from API, load screen.
    const screenElement = document.querySelector(".game .screen");
    const cardsScreen = new CardsScreen(this.settings);
    cardsScreen.load(screenElement);

    this._hideLoader();
  }

  _showLoader() {
    this.wrapperElement.classList.add("loading");
  }

  _hideLoader() {
    this.wrapperElement.classList.remove("loading");
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
