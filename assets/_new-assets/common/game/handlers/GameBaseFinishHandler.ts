
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";
import GameBaseTimeHandler from "./GameBaseTimeHandler";

export default class GameBaseFinishHandler implements DataHandler {
    constructor(
        protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.finish) {
            this.main.timeHandler.resetTime();
            this.handleFinishData(data.finish);
        }

        return true;
    }

    handleFinishData(dataFinish) {
    }
}
