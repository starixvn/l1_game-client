
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseBetHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.totalBets || data.ownBets) {
            this.main.showProcessingWarning(false);
            this.main.betItems.forEach(item => item.setData(data));
        }

        if (data.endCuoc) {
            data.endCuoc != -1 && this.main.showAcceptedBet(data.endCuoc); //endCuoc -1 is error
            this.main.showProcessingWarning(false);
        }

        return true;
    }
}
