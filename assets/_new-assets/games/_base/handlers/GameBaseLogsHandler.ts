import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseLogsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.roundHistory) {
            this.main.currentDataLogs = data.roundHistory;
            this.main.roundId = data.roundHistory[0] ? data.roundHistory[0].roundId : 1;
            this.buildLogs(data.roundHistory);
        }

        return true;
    }

    buildLogs(dataLogs) {
    }
}
