import Cache from "./Infrastructure/Cache.js";
import CardsScreen from "./Screen/CardsScreen.js";
import ConfigureScreen from "./Screen/ConfigureScreen.js";
import EventDispatcher from "./Infrastructure/EventDispatcher.js";
import Generation from "./Pokemon/Generation.js";
import PokeApi from "./Infrastructure/PokeApi.js";
import Pokemon from "./Pokemon/Pokemon.js";

export default class Game {
  constructor(settings, rootElement) {
    this.settings = settings;
    this.rootElement = rootElement;
    this.wrapperElement = document.createElement("div");
    this.pokeApi = new PokeApi();

    this._bindEventListeners();
  }

  async start() {
    this._showLoader();

    this._initialize();
    await this._retrieveAndCacheData();
  
    EventDispatcher.dispatch(new Event("gameDataWasLoaded"));

    this._hideLoader();
  }

  _bindEventListeners() {
    const body = document.querySelector("body");

    body.addEventListener("gameDataWasLoaded", () => {
      this._gameDataWasLoaded();
    });
  }

  _gameDataWasLoaded() {
    // Game data has been loaded from API, load configure screen.
    const screenElement = document.querySelector(".game .screen");
    const configureScreen = new ConfigureScreen(this.settings);
    configureScreen.load(screenElement);

    //const cardsScreen = new CardsScreen(this.settings);
    //cardsScreen.load(screenElement);
  }

  _initialize() {
    this.wrapperElement.classList.add(...["game"]);

    const loaderElement = document.createElement("div");
    loaderElement.innerText = "Loading";
    loaderElement.classList.add(...["loader"]);

    const screenElement = document.createElement("div");
    screenElement.classList.add(...["screen"]);

    this.wrapperElement.append(loaderElement, screenElement);
    this.rootElement.append(this.wrapperElement);
  }

  _showLoader() {
    this.wrapperElement.classList.add("loading");
  }

  _hideLoader() {
    this.wrapperElement.classList.remove("loading");
  }

  async _retrieveAndCacheData() {
    if (!Cache.isWarmedUpForGenerations()) {
      // Warm cache with generations.
      const generations = await this.pokeApi.getGenerations();
      for (const generation of generations) {
        const apiGeneration = await this.pokeApi.getGeneration(generation.name);
        const gen = Generation.createFromApi(apiGeneration);
        Cache.addGeneration(gen.getId(), gen);
      }
    }

    if (!Cache.isWarmedUpForPokemonInGeneration(this.settings.getGeneration())) {
      // Warm cache with pokemon for the current selected generation.
      const pokemonIndexes = this.settings.getGeneration().getPokemonIndexes();

      for (let i = 0; i < pokemonIndexes.length; i++) {
        const apiPokemon = await this.pokeApi.getPokemon(pokemonIndexes[i]);
        const pokemon = Pokemon.createFromApi(apiPokemon);
        Cache.addPokemon(pokemon.getId(), pokemon);
      }
    }
  }

  static _sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
