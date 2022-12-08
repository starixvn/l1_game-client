import BaccaratFinishHandler from "../../../baccarat/view-models/data-handlers/BaccaratFinishHandler";
import WinThreeCards from "../WinThreeCards";
import { WinThreeCardResult } from "../WinThreeCardsCards";
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

    handleFinishData(dataFinish: any, dataResultHash: any, onFinishHandlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHandlingData);

        const baccaratMain = this.getOwnMain();
        if (!dataFinish.result) {
            return;
        }

        this.showCards(dataFinish, dataResultHash, baccaratMain, onFinishHandlingData);
    }

    protected showCards(dataFinish: any, dataResultHash: any, baccaratMain: any, onFinishHandlingData: () => void) {
        // baccaratMain.showScoreBoardNextDot = true;
        const result = dataFinish.result;
        const settlementResult = dataFinish.settlementResult;
        const showResultFunc = () => {
            // baccaratMain.showScoreBoardNextDot = false;
            this.main.md5Component?.updateMD5String(dataResultHash);
            this.showResult(settlementResult);
            this.showWinNotice(settlementResult);
            onFinishHandlingData && onFinishHandlingData();
            // this.insertCurrentDataLogs(baccaratMain, dataFinish);
            // baccaratMain.currentDataLogs.length > 102 && this.main.currentDataLogs.pop();
            // (baccaratMain.logsHandler as BaccaratLogsHandler).buildLogs(baccaratMain.currentDataLogs);
            // (baccaratMain.bigRoad as BaccaratBigRoad).renderScoreBoardEachRound(settlementResult);
            // this.handleBuildMiniLogs(baccaratMain);
        };

        baccaratMain.playerCards.showCards(new WinThreeCardResult(result.phoenix), showResultFunc);
        baccaratMain.bankerCards.showCards(new WinThreeCardResult(result.dragon), showResultFunc);
    }
}
