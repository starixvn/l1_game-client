import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import Baccarat from "../Baccarat";
import * as _ from "lodash";
import { BasicHistoryData } from "../../../_base/view-models/BasicHistoryBoard";
import { getLowercaseObjectKeys } from '../../../../common/helpers/Helper.js';
import { TotalHistoryData } from "../TotalHistoryBoard";

export default class BaccaratLogsHandler extends GameBaseLogsHandler {

    constructor(protected readonly main: Baccarat) {
        super(main);
    }

    buildLogs(dataLogs) {
        this.buildBasicHistoryBoard(dataLogs);
        this.buildTotalHistoryBoard(dataLogs);
    }

    private buildBasicHistoryBoard(dataLogs: any) {
        const historyData = _.map(dataLogs, (log) => {
            const result = log.result;
            if (result.banker) {
                return new BasicHistoryData("banker", "0");
            }
            if (result.player) {
                return new BasicHistoryData("player", "0");
            }
            if (result.tie) {
                return new BasicHistoryData("tie", "0");
            }
        });

        this.main.basicHistoryBoard.setData(historyData.reverse());
    }

    private buildTotalHistoryBoard(dataLogs: any) {
        const totalHistoryData = _.map(this.main.betItems, item => {
            const resultKeys = getLowercaseObjectKeys(dataLogs[0].result);
            const total = _.filter(dataLogs, log => log.result[resultKeys[item.node.name.toLowerCase()]]).length;
            return new TotalHistoryData(item.node.name, total.toString());
        });
        this.main.totalHistoryBoard.setData(totalHistoryData);
    }
}
