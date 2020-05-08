
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseLogsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.roundHistory) {
            this.main.currentDataLogs = data.roundHistory;
            this.buildLogs(data.rounds);
        }

        return true;
    }



    buildLogs(dataLogs) {
    }
}
