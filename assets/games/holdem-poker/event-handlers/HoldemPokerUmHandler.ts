import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmDataHandler";
import WebSocketTableGameBase from "../../_base/WebSocketTableGameBase";

export default class HoldemPokerUmHandler extends GameBaseUmDataHandler {
    constructor(protected readonly main: WebSocketTableGameBase) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.um) {
            return false;
        }
        this.main.showUmMessage(data);
        this.main.disableGame();

        return true;
    }
}
