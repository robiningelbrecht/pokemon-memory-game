import Game from "./Game/Game.js";
import Settings from "./Game/Settings.js";

const game = new Game(
  Settings.default(),
  document.querySelector("body")
);
game.start();

// @TODO: keep track of moves and time.
