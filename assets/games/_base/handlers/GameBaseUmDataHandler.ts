import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseUmDataHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any) {
        if (!data.um) {
            return;
        }

        if (this.main.currentTimeRemaining <= this.main.config.betTime || data.remainingTime === this.main.config.fullTime) {
            this.main.showUmMessage(data);
            this.main.disableGame();
        }
    }
}
