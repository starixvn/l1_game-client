
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseLogsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.logs) {
            this.main.currentDataLogs = data.logs;
            this.buildLogs(data.logs);
        }

        return true;
    }



    buildLogs(dataLogs) {
    }
}
