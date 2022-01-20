import Game from "./Game/Game.js";
import PokeApi from "./Game/PokeApi.js";
import Cache from "./Game/Cache.js";

const game = new Game(
  new PokeApi(),
  new Cache(),
  30,
  document.querySelector("div.cards")
);
game.render();

// @TODO: keep track of moves.
// @TODO: Add possibility to change game settings (# pairs, gen 1, 2, 3,...)
