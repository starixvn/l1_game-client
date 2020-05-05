
import DataHandler from "../../_base/view-models/DataHandler";
import GameBase from "../GameBase";

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
