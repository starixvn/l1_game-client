import BaccaratFinishHandler from "../../../baccarat/view-models/data-handlers/BaccaratFinishHandler";
import WinThreeCards from "../WinThreeCards";
import WinThreeCardsLogsHandler from "./WinThreeCardsLogsHandler";

export default class WinThreeCardsFinishHandler extends BaccaratFinishHandler {
    protected getOwnMain(): any {
        return this.main as WinThreeCards;
    }
    protected handleBuildMiniLogs(baccaratMain: any) {
        // const logsHandler = baccaratMain.logsHandler as WinThreeCardsLogsHandler;
        // const currentDataLogs = logsHandler.convertLogsDataLogs(baccaratMain.currentDataLogs);
        // baccaratMain.needHideNextDotRoundHistory = true;
        // baccaratMain.miniRoundHistory.setData(currentDataLogs);
    }
}
