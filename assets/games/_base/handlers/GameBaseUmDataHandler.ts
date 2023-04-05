import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseUmDataHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any) {
        this.main.isReceivedUMData = !!data.um;

        if (!data.um) {
            return;
        }

        if (this.main.checkShowUmMessage(data)) {
            this.main.showUmMessage(data);
            this.main.disableGame();
        }
    }
}
