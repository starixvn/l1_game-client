import BaccaratFinishHandler from "../../../baccarat/view-models/data-handlers/BaccaratFinishHandler";
import WinThreeCards from "../WinThreeCards";
import { i18n } from "../../../../ClientModules";
import { WinThreeCardResult } from "../models/WinThreeCardsModel";

export default class WinThreeCardsFinishHandler extends BaccaratFinishHandler {
    protected getOwnMain(): WinThreeCards {
        return this.main as WinThreeCards;
    }

    protected showCards(dataFinish: any, dataResultHash: any, baccaratMain: WinThreeCards, onFinishHandlingData: () => void) {
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
            baccaratMain.logsHandler.buildBasicScoreBoard(baccaratMain.currentDataLogs);
            baccaratMain.scoreboard.renderScoreBoardInGame(baccaratMain.currentDataLogs);
        };

        baccaratMain.phoenixCards.showCards(new WinThreeCardResult(result.phoenix), null);
        baccaratMain.dragonCards.showCards(new WinThreeCardResult(result.dragon), showResultFunc);
    }

    public showWinNotice(settlementResult) {
        const baccaratMain = this.getOwnMain();
        const winNoticeNode = baccaratMain.winNoticeLabel.node.parent;
        let key = "";

        if (settlementResult.dragon) {
            key = "dragon_win";
            baccaratMain.dragonCards.showHighlightCards();
        } else if (settlementResult.phoenix) {
            key = "phoenix_win";
            baccaratMain.phoenixCards.showHighlightCards();
        } else {
            key = "tie";
        }

        baccaratMain.winNoticeLabel.string = i18n.t(`winThreeCards.${key}`).toUpperCase();
        winNoticeNode.active = true;
    }

    protected insertCurrentDataLogs(baccaratMain: any, dataFinish: any) {
        if (dataFinish.winningPlayers) {
            delete dataFinish.winningPlayers;
        }

        baccaratMain.currentDataLogs.unshift(dataFinish);
    }
}
