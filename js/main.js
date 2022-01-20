import Game from "./Game/Game.js";
import PokeApi from "./Game/PokeApi.js";
import Cache from "./Game/Cache.js";
import Pokemon from "./Game/Pokemon.js";

const game = new Game(
  new PokeApi(),
  new Cache(),
  10,
  document.querySelector("div.cards")
);
game.render();

// @TODO: keep track of moves.
