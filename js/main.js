import Game from "./Game/Game.js";
import PokeApi from "./Game/PokeApi.js";
import Cache from "./Game/Cache.js";
import Pokemon from "./Game/Pokemon.js";

const body = document.querySelector("body");

const game = new Game(
  new PokeApi(),
  new Cache(),
  10,
  document.querySelector("div.cards")
);
await game.retrieveAndCacheData();
game.render();

// Data has been loaded and cached.
// Game has been rendered.
body.classList.remove("loading");

// @TODO: keep track of moves.
