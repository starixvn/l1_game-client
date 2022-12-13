import BaccaratFinishHandler from "../../../baccarat/view-models/data-handlers/BaccaratFinishHandler";
import WinThreeCardsBigRoad from "../../components/score-board/view-models/WinThreeCardsBigRoad";
import WinThreeCards from "../WinThreeCards";
import { WinThreeCardResult } from "../WinThreeCardsCards";
import BaccaratLogsHandler from "../../../baccarat/view-models/data-handlers/BaccaratLogsHandler";
import { i18n } from "../../../../ClientModules";

export default class WinThreeCardsFinishHandler extends BaccaratFinishHandler {
    protected getOwnMain(): any {
        return this.main as WinThreeCards;
    }

    protected showCards(dataFinish: any, dataResultHash: any, baccaratMain: any, onFinishHandlingData: () => void) {
        baccaratMain.showScoreBoardNextDot = true;
        const result = dataFinish.result;
        const settlementResult = dataFinish.settlementResult;
        const showResultFunc = () => {
            baccaratMain.showScoreBoardNextDot = false;
            this.main.md5Component?.updateMD5String(dataResultHash);
            this.showResult(settlementResult);
            this.showWinNotice(settlementResult);
            onFinishHandlingData && onFinishHandlingData();
            this.insertCurrentDataLogs(baccaratMain, dataFinish);
            baccaratMain.currentDataLogs.length > 102 && this.main.currentDataLogs.pop();
            (baccaratMain.logsHandler as BaccaratLogsHandler).buildLogs(baccaratMain.currentDataLogs);
            (baccaratMain.bigRoad as WinThreeCardsBigRoad).renderScoreBoardEachRound(settlementResult);
            // this.handleBuildMiniLogs(baccaratMain);
        };

        baccaratMain.playerCards.showCards(new WinThreeCardResult(result.dragon), showResultFunc);
        baccaratMain.bankerCards.showCards(new WinThreeCardResult(result.phoenix), showResultFunc);
    }

    public showWinNotice(settlementResult) {
        const baccaratMain = this.getOwnMain();
        const winNoticeNode = baccaratMain.winNoticeLabel.node.parent;
        let key = "";

        if (settlementResult.dragon) {
            key = "dragon_win";
            baccaratMain.bankerCards.showHighlightCards();
        } else if (settlementResult.phoenix) {
            key = "phoenix_win";
            baccaratMain.playerCards.showHighlightCards();
        } else {
            key = "tie";
        }

        baccaratMain.winNoticeLabel.string = i18n.t(`winThreeCards.${key}`).toUpperCase();
        winNoticeNode.active = true;
    }
}
