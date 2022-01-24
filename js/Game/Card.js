export default class Card {
  constructor(id, name, type, sprite) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.sprite = sprite;
  }

  getElement() {
    const cardElement = document.createElement("flippable-card");
    cardElement.classList.add(...["type", "type--" + this.type]);
    cardElement.setAttribute('flipped', '');

    cardElement.innerHTML =
      '<div slot="front"><img src="' +
      this.sprite +
      '" /><p>#' +
      this.id +
      " " +
      this.name +
      '</p></div><div slot="back"></div>';

    return cardElement;
  }

  static createFromPokemon(pokemon) {
    return new Card(
      pokemon.getId(),
      pokemon.getName(),
      pokemon.getTypes()[0],
      pokemon.getSprite()
    );
  }
}
