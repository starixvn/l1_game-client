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

        const detailHistoryData = _.map(dataLogs, (log, index) => {
            const result = log.result;
            const previousLog = dataLogs[parseInt(index) - 1];

            if (result.banker) {
                return 0;
            }

            if (result.player) {
                return 1;
            }

            if (result.tie) {
                if (!previousLog) {
                    return 2;
                }

                if (previousLog.result.banker) {
                    return 2;
                }

                if (previousLog.result.player) {
                    return 3;
                }
                else {
                    return 0;
                }
            } else {
                return 0;
            }
        })
        console.log(detailHistoryData)
        this.main.detailHistoryBoard.setData(detailHistoryData.reverse());
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
