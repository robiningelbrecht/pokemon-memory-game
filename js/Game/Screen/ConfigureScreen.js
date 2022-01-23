import Cache from "../Infrastructure/Cache.js";
import EventDispatcher from "../Infrastructure/EventDispatcher.js";
import Game from "../Game.js";

export default class ConfigureScreen {
  constructor(settings) {
    this.settings = settings;
  }

  load(parentElement) {
    const generations = Cache.getGenerations();
    const generationsSelectEl = document.createElement('select');

    generations.forEach(generation => {
      const option = document.createElement("option");
      option.value = generation.getId();
      option.text = generation.getMainRegion();
      generationsSelectEl.appendChild(option);
    });

    const buttonElement = document.createElement('button');
    buttonElement.innerText = 'Start game';

    parentElement.append(generationsSelectEl, buttonElement);

    buttonElement.addEventListener("click", () => {
      EventDispatcher.dispatch(new Event("gameWasConfigured"));
    });
  }
}
