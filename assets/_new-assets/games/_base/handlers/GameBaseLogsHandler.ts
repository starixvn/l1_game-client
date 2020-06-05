import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseLogsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.roundHistory && data.roundHistory[0]) {
            this.main.currentDataLogs = data.roundHistory;
            this.main.roundId = data.roundHistory[0].id;
            this.buildLogs(data.roundHistory);
        }
        else {
            this.main.roundId = 1;
        }

        return true;
    }

    buildLogs(dataLogs) {
    }
}
