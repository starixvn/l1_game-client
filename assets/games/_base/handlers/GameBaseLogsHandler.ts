import _ = require("lodash");

import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseLogsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any) {
        if (data.roundId) {
            this.main.roundId = data.roundId;
        }

        if (data.roundHistory) {
            this.main?.md5Component?.resetMd5();
            this.main.currentDataLogs = _.cloneDeep(data.roundHistory);
            if (this.main.currentDataLogs.length > 0) {
                this.buildLogs(this.main.currentDataLogs);
            }
        }
    }

    buildLogs(dataLogs) {}
}
