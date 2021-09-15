export default class DropDownOption {
    constructor(gameId: number, text: string) {
        this.gameId = gameId;
        this.text = text;
    }

    gameId = 0;

    text = "";
}
