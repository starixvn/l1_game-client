import DataHandler from "./DataHandler";
import GameBase from "../GameBase";

export default class GameBaseUmDataHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (!data.um) {
            return false;
        }

        if (this.main.currentTimeRemaining <= this.main.config.betTime || data.remainingTime == this.main.config.fullTime) {
            this.main.showUmMessage(data);
            this.main.disableGame();

            return true;
        }

        return false;
    }
}
