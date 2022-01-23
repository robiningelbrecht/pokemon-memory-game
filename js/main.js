import Game from "./Game/Game.js";
import Settings from "./Game/Settings.js";

const game = new Game(Settings.default(), document.querySelector("body"));
game.start();

// @TODO: keep track of moves and time.

const thisBody = document.querySelector("body");
// Lazy load high def version of background.
window.onload = () => {
  let img = new Image();

  // Assign an onLoad handler to the dummy image *before* assigning the src
  img.onload = () => {
    thisBody.style.backgroundImage = "url(" + thisBody.dataset.background + ")";
  };
  // Finally, trigger the whole preloading chain by giving the dummy
  // image its source.
  img.src = thisBody.dataset.background;
};
