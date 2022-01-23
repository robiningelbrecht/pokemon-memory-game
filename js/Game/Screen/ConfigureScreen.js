import Cache from "../Infrastructure/Cache.js";
import EventDispatcher from "../Infrastructure/EventDispatcher.js";

export default class ConfigureScreen {
  constructor(settings) {
    this.settings = settings;
  }

  load(parentElement) {
    const generations = Cache.getGenerations();
    const generationsSelectEl = document.createElement("select");

    generations.forEach((generation) => {
      const option = document.createElement("option");
      option.value = generation.getId();
      option.text = generation.getMainRegion();
      generationsSelectEl.appendChild(option);
    });

    const numberofPairsElement = document.createElement('input');
    numberofPairsElement.setAttribute("type", "number");
    numberofPairsElement.setAttribute("min", "1");
    numberofPairsElement.setAttribute("max", "10");
    numberofPairsElement.setAttribute("step", "1");
    numberofPairsElement.setAttribute("value", this.settings.getNumberOfPairs());

    const buttonElement = document.createElement("button");
    buttonElement.innerText = "Start game";

    parentElement.append(numberofPairsElement, generationsSelectEl, buttonElement);

    buttonElement.addEventListener("click", () => {
      EventDispatcher.dispatch(
        new CustomEvent("gameWasConfigured", {
          detail: {
            generation: Cache.getGeneration(generationsSelectEl.value),
            numberOfPairs: numberofPairsElement.value
          },
        })
      );
    });
  }
}
