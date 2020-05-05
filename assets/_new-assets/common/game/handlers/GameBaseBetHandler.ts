
import DataHandler from "../../_base/view-models/DataHandler";
import GameBase from "../GameBase";

export default class GameBaseBetHandler implements DataHandler {
    constructor(private readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.data || data.me) {
            this.main.showProcessingWarning(false);
            this.main.betItems.forEach(item => item.setData(data));
        }

        if (data.endCuoc) {
            this.main.waitingProcessing = false;
            data.endCuoc != -1 && this.main.showAcceptedBet(data.endCuoc); //endCuoc -1 is error
            this.main.showProcessingWarning(false);
        }
        return true;
    }
}
