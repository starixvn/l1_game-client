import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import Baccarat from "../Baccarat";
import * as _ from "lodash";
import { NormalHistoryData } from "../BaccaratHistory";

export default class BaccaratLogsHandler extends GameBaseLogsHandler {

    constructor(protected readonly main: Baccarat) {
        super(main);
    }

    buildLogs(dataLogs) {
        const historyData = _.map(dataLogs, (log) => {
            const result = log.result;

            if (result.banker) {
                return new NormalHistoryData("banker", "0")
            }

            if (result.player) {
                return new NormalHistoryData("player", "0")
            }

            if (result.tie) {
                return new NormalHistoryData("tie", "0")
            }
        })

        this.main.historyBoard.setData(historyData.reverse());
    }
}
