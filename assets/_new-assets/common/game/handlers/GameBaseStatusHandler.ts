
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseStatusHandler implements DataHandler {
    constructor(private readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.status && data.bet) {
            this.main.status(data.status, data.bet);
        }
        return true;
    }
}
