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

    protected getDataFollowTypePlayer(data: any, isBanker: boolean) {
        if (isBanker) {
            return Object.values(data.phoenix.cards).filter((value) => value != null);
        }
        return Object.values(data.dragon.cards).filter((value) => value != null);
    }

    protected showCards(dataFinish: any, dataResultHash: any, baccaratMain: any, onFinishHandlingData: () => void) {
        // baccaratMain.showScoreBoardNextDot = true;
        const result = dataFinish.result;
        const settlementResult = dataFinish.settlementResult;
        const playerCards = this.getDataFollowTypePlayer(result, false);
        const bankerCards = this.getDataFollowTypePlayer(result, true);
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

        baccaratMain.playerCards.showCards(playerCards, bankerCards.length === 3 ? null : showResultFunc);
        baccaratMain.bankerCards.showCards(bankerCards, bankerCards.length === 3 ? showResultFunc : null, playerCards.length === 3);
    }
}
