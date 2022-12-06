import BaccaratLogsHandler from "../../../baccarat/view-models/data-handlers/BaccaratLogsHandler";
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
        const ownMain = this.getOwnMain();
        ownMain.miniRoundHistory.setData(dataLogs);
    }

    protected getLogDataFollowTypePlayer(isBanker: boolean, data: any) {
        const resultTmp = data.result;
        if (isBanker) {
            return Object.values(resultTmp.phoenix).filter((value) => value != null);
        }
        return Object.values(resultTmp.dragon).filter((value) => value != null);
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
            data.banker = Object.values(result.phoenix).filter((value) => value != null);
            data.player = Object.values(result.dragon).filter((value) => value != null);
            data.result = settlementResult;
            data.roundId = element.roundId;

            logs.push(data);
        });

        return logs;
    }
}
