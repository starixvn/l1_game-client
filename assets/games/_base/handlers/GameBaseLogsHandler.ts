import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseLogsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any): boolean {
        if (data.roundHistory) {
            this.main.currentDataLogs = data.roundHistory;
            if (this.main.currentDataLogs.length > 0) {
                this.buildLogs(this.main.currentDataLogs);
            }
        }

        if (data.roundId) {
            this.main.roundId = data.roundId;
        }

        return true;
    }

    buildLogs(dataLogs) {}
}
