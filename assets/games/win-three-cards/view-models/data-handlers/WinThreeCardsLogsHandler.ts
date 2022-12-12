import * as _ from "lodash";
import BaccaratLogsHandler from "../../../baccarat/view-models/data-handlers/BaccaratLogsHandler";
import { BasicHistoryData } from "../../../_base/view-models/BasicHistoryBoard";
import WebSocketTableGameBase from "../../../_base/WebSocketTableGameBase";
import WinThreeCards from "../WinThreeCards";
import WinThreeCardsFinishHandler from "./WinThreeCardsFinishHandler";

export default class WinThreeCardsLogsHandler extends BaccaratLogsHandler {
    constructor(protected readonly main: WebSocketTableGameBase) {
        super(main);
    }

    protected getOwnMain(): any {
        return this.main as WinThreeCards;
    }

    protected getOwnFinishHandle(): any {
        const ownMain = this.getOwnMain();
        return ownMain.finishHandler as WinThreeCardsFinishHandler;
    }

    protected updateMiniHistoryLogs(dataLogs: any) {
        // handle
    }

    protected getLogDataFollowTypePlayer(isBanker: boolean, data: any) {
        const resultTmp = data.result;
        if (isBanker) {
            return Object.values(resultTmp.phoenix.cards).filter((value) => value != null);
        }
        return Object.values(resultTmp.dragon.cards).filter((value) => value != null);
    }

    public convertLogsDataLogs(dataLogs: any) {
        const logs = [];
        dataLogs.forEach((element: any) => {
            const data = {
                banker: {},
                player: {},
                result: {},
                roundId: 0
            };
            const settlementResult = element.settlementResult;
            const result = element.result;
            data.banker = Object.values(result.phoenix.cards).filter((value) => value != null);
            data.player = Object.values(result.dragon.cards).filter((value) => value != null);
            data.result = settlementResult;
            data.roundId = element.roundId;

            logs.push(data);
        });

        return logs;
    }

    protected buildBasicScoreBoard(dataLogs: any) {
        // handle
        const historyData = _.map(dataLogs, (log) => {
            const result = log.result;
            if (result.dragon) {
                return new BasicHistoryData("dragon", "0");
            }
            if (result.phoenix) {
                return new BasicHistoryData("phoenix", "0");
            }
            if (result.tie) {
                return new BasicHistoryData("tie", "0");
            }

            return new BasicHistoryData("", "0");
        });

        const ownMain = this.getOwnMain();
        const tmpData = [...historyData].reverse();
        ownMain.basicHistoryBoard.setData(tmpData);
    }
    protected buildTotalScoreBoard(dataLogs: any) {
        // handle
    }
}
