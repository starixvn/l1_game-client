import BaccaratFinishHandler from "../../../baccarat/view-models/data-handlers/BaccaratFinishHandler";
import WinThreeCards from "../WinThreeCards";
import WinThreeCardsLogsHandler from "./WinThreeCardsLogsHandler";

export default class WinThreeCardsFinishHandler extends BaccaratFinishHandler {
    protected getOwnMain(): any {
        return this.main as WinThreeCards;
    }
    protected handleBuildMiniLogs(baccaratMain: any) {
        const logsHandler = baccaratMain.logsHandler as WinThreeCardsLogsHandler;
        const currentDataLogs = logsHandler.convertLogsDataLogs(baccaratMain.currentDataLogs);
        baccaratMain.needHideNextDotRoundHistory = true;
        baccaratMain.miniRoundHistory.setData(currentDataLogs);
    }

    protected getDataFollowTypePlayer(data: any, isBanker: boolean) {
        if (isBanker) {
            return Object.values(data.phoenix).filter((value) => value != null);
        }
        return Object.values(data.dragon).filter((value) => value != null);
    }
}
