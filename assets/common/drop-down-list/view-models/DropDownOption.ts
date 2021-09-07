export default class DropDownOption {
    constructor(gameId: number, value: string, text: string) {
        this.gameId = gameId;
        this.value = value;
        this.text = text;
    }

    gameId = 0;

    value = "";

    text = "";
}
