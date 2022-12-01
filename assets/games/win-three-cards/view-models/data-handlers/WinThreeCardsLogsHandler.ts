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
        // const ownMain = this.getOwnMain();
        // return ownMain.finishHandler as WinThreeCardsFinishHandler;
    }

    protected updateMiniHistoryLogs(dataLogs: any) {
        // const ownMain = this.getOwnMain();
        // ownMain.miniRoundHistory.setData(dataLogs);
    }
}
