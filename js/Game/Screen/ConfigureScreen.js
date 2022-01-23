import Cache from "../Infrastructure/Cache.js";

export default class ConfigureScreen {
  constructor(settings) {
    this.settings = settings;
  }

  load(parentElement) {
    parentElement.classList.add(...["screen--configure"]);

    const generations = Cache.getGenerations();
    const generationsSelectEl = document.createElement('select');

    generations.forEach(generation => {
      const option = document.createElement("option");
      option.value = generation.getId();
      option.text = generation.getMainRegion();
      generationsSelectEl.appendChild(option);
    });

    parentElement.append(generationsSelectEl);
  }
}
