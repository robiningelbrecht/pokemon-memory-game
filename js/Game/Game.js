import Cache from "./Infrastructure/Cache.js";
import CardsScreen from "./Screen/CardsScreen.js";
import ConfigureScreen from "./Screen/ConfigureScreen.js";
import EventDispatcher from "./Infrastructure/EventDispatcher.js";
import Generation from "./Pokemon/Generation.js";
import PokeApi from "./Infrastructure/PokeApi.js";
import Pokemon from "./Pokemon/Pokemon.js";
import Settings from "./Settings.js";
import ScoreScreen from "./Screen/ScoreScreen.js";

export default class Game {
  constructor(settings, rootElement) {
    this.settings = settings;
    this.rootElement = rootElement;
    this.wrapperElement = document.createElement("div");

    this._bindEventListeners();
  }

  async start() {
    this._showLoader();

    this._initialize();
    await Game.retrieveAndCacheData(this.settings.getGeneration());

    EventDispatcher.dispatch(new Event("gameWasInitialized"));

    this._hideLoader();
  }

  _bindEventListeners() {
    const body = document.querySelector("body");

    body.addEventListener("gameWasInitialized", () => {
      // Game was initialized, load configure screen.
      this._loadScreen(new ConfigureScreen(this.settings));
    });
    body.addEventListener("gameWasConfigured", async (event) => {
      // Game was configured. Cache pissible new data and load screen.
      this._showLoader();
      const generation = event.detail.generation;

      await Game.retrieveAndCacheData(generation);
      // Override settings with newly configured ones.
      this.settings = new Settings(generation, event.detail.numberOfPairs);

      this._loadScreen(new CardsScreen(this.settings));
      this._hideLoader();
    });
    body.addEventListener("gameWasCompleted", (event) => {
      // Show score screen.
      this._loadScreen(
        new ScoreScreen(
          this.settings,
          event.detail.numberOfMoves,
          event.detail.timeToComplete
        )
      );
    });
    body.addEventListener("gameShouldBeRestarted", () => {
      // @TODO: show cards screen again.
    });
    body.addEventListener("gameShouldBeReconfigured", () => {
      // @TODO: show configure screen again.
    });
  }

  _loadScreen(screen) {
    const screenElement = document.querySelector(".game .screen");
    screenElement.innerHTML = "";
    this._removeClasseswithPrefix(screenElement, "screen--");
    this._removeClasseswithPrefix(this.wrapperElement, "screen--");

    this.wrapperElement.classList.add(
      ...["screen--" + screen.constructor.name]
    );
    screenElement.classList.add(...["screen--" + screen.constructor.name]);
    screen.load(screenElement);
  }

  _initialize() {
    this.wrapperElement.classList.add(...["game"]);

    const loaderElement = document.createElement("div");
    loaderElement.innerText = "Loading...";
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

  _removeClasseswithPrefix(element, prefix) {
    const regx = new RegExp("\\b" + prefix + "[^ ]*[ ]?\\b", "g");
    element.className = element.className.replace(regx, "");
    return element;
  }

  static async retrieveAndCacheData(generation) {
    if (!Cache.isWarmedUpForGenerations()) {
      // Warm cache with generations.
      const generations = await PokeApi.getGenerations();
      for (const generation of generations) {
        const apiGeneration = await PokeApi.getGeneration(generation.name);
        const gen = Generation.createFromApi(apiGeneration);
        Cache.addGeneration(gen.getId(), gen);
      }
    }

    if (!Cache.isWarmedUpForPokemonInGeneration(generation)) {
      // Warm cache with pokemon for the current selected generation.
      const pokemonIndexes = generation.getPokemonIndexes();

      for (let i = 0; i < pokemonIndexes.length; i++) {
        const apiPokemon = await PokeApi.getPokemon(pokemonIndexes[i]);
        const pokemon = Pokemon.createFromApi(apiPokemon);
        Cache.addPokemon(pokemon.getId(), pokemon);
      }
    }
  }

  static _sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
