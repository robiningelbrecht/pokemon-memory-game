import EventDispatcher from "../Infrastructure/EventDispatcher.js";

export default class ScoreScreen {
  constructor(settings, numberOfMoves, timeToComplete) {
    this.settings = settings;
    this.numberOfMoves = numberOfMoves;
    this.timeToComplete = timeToComplete;
  }

  load(parentElement) {
    const numberOfMovesElement = document.createElement("p");
    numberOfMovesElement.innerHTML =
      "You completed the game in <strong>" +
      this._humanizeMilliseconds(this.timeToComplete) +
      "</strong> using <strong>" +
      this.numberOfMoves +
      "</strong> moves";

    const restartButtonElement = document.createElement("button");
    restartButtonElement.innerText = "Restart game";

    const reconfigureButtonElement = document.createElement("button");
    reconfigureButtonElement.innerText = "Restart game with new settings";

    parentElement.append(
      numberOfMovesElement,
      restartButtonElement,
      reconfigureButtonElement
    );

    restartButtonElement.addEventListener("click", () => {
      // Dispatch "gameWasConfigured" event with same settings again.
      // This will load the cards screen.
      EventDispatcher.dispatch(
        new CustomEvent("gameWasConfigured", {
          detail: {
            generation: this.settings.getGeneration(),
            numberOfPairs: this.settings.getNumberOfPairs(),
          },
        })
      );
    });

    reconfigureButtonElement.addEventListener("click", () => {
      // Dispatch the "gameWasInitialized" event again, this will lad the configure screen.
      EventDispatcher.dispatch(new Event("gameWasInitialized"));
    });
  }

  _humanizeMilliseconds(milliseconds) {
    const granularValues = {
      hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((milliseconds / (1000 * 60)) % 60),
      seconds: Math.floor((milliseconds / 1000) % 60),
    };

    const labels = [];
    for (const [key, value] of Object.entries(granularValues)) {
      if (value === 0) {
        continue;
      }

      labels.push(value + " " + key);
    }

    return labels.join(" and ");
  }
}
