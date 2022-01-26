import Cache from "../Infrastructure/Cache.js";
import EventDispatcher from "../Infrastructure/EventDispatcher.js";

export default class ConfigureScreen {
  constructor(settings) {
    this.settings = settings;
  }

  load(parentElement) {
    const titleElement = document.createElement('h2');
    titleElement.innerText = 'Memory game';

    const numberOfPairsLabel = this._buildLabelElement('Enter the number of pairs you want to play with (1 - 10)');
    const numberofPairsElement = this._buildNumberOfPairsElement();

    const generationsLabel = this._buildLabelElement('Select the region you want to play in');
    const generationsSelectEl = this._buildGenerationsElement();

    const buttonElement = document.createElement("button");
    buttonElement.innerText = "Start game";

    parentElement.append(
      titleElement,
      numberOfPairsLabel, 
      numberofPairsElement, 
      generationsLabel,
      generationsSelectEl, 
      buttonElement
      );

    buttonElement.addEventListener("click", () => {
      EventDispatcher.dispatch(
        new CustomEvent("gameWasConfigured", {
          detail: {
            generation: Cache.getGeneration(generationsSelectEl.value),
            numberOfPairs: numberofPairsElement.value ? numberofPairsElement.value : 10,
          },
        })
      );
    });
  }

  _buildNumberOfPairsElement(){
    const numberofPairsElement = document.createElement('input');
    numberofPairsElement.setAttribute("type", "number");
    numberofPairsElement.setAttribute("min", "1");
    numberofPairsElement.setAttribute("max", "10");
    numberofPairsElement.setAttribute("step", "1");
    numberofPairsElement.setAttribute("value", this.settings.getNumberOfPairs());
    numberofPairsElement.setAttribute("required", "");

    return numberofPairsElement;
  }

  _buildGenerationsElement(){
    const generations = Cache.getGenerations();

    const generationsSelectEl = document.createElement("select");

    generations.forEach((generation) => {
      const option = document.createElement("option");
      option.value = generation.getId();
      option.text = generation.getMainRegion();
      generationsSelectEl.appendChild(option);
    });

    return generationsSelectEl;
  }

  _buildLabelElement(text){
    const label = document.createElement('label');
    label.innerText = text;

    return label;
  }
}
