
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseLogsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.rounds) {
            this.main.currentDataLogs = data.rounds;
            this.buildLogs(data.rounds);
        }

        return true;
    }



    buildLogs(dataLogs) {
    }
}
