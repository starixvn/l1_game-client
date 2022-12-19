import BaccaratFinishHandler from "../../../baccarat/view-models/data-handlers/BaccaratFinishHandler";
import WinThreeCards from "../WinThreeCards";
import { i18n } from "../../../../ClientModules";
import { WinThreeCardResult } from "../models/WinThreeCardsModel";

export const GapTime = {
    normal: 0.8,
    thirdCard: 1
};

export default class WinThreeCardsFinishHandler extends BaccaratFinishHandler {
    protected getOwnMain(): WinThreeCards {
        return this.main as WinThreeCards;
    }

    protected showCards(data: any, dataResultHash: any, mainGame: WinThreeCards, onFinishHandlingData: () => void) {
        mainGame.showScoreBoardNextDot = true;

        const { phoenix, dragon } = data.result;
        const dragonResult = new WinThreeCardResult(dragon);
        const phonenixResult = new WinThreeCardResult(phoenix);

        const { dragonCards, phoenixCards } = mainGame;
        mainGame.node.runAction(
            cc.sequence(
                cc.callFunc(() => dragonCards.showFirstTwoCards(dragonResult)),
                cc.delayTime(GapTime.normal),
                cc.callFunc(() => phoenixCards.showFirstTwoCards(phonenixResult)),
                cc.delayTime(GapTime.normal),

                cc.callFunc(() => dragonCards.showLastCard(dragonResult)),
                cc.delayTime(GapTime.thirdCard),
                cc.callFunc(() => dragonCards.setRank(dragonResult)),
                cc.delayTime(GapTime.normal),

                cc.callFunc(() => phoenixCards.showLastCard(phonenixResult)),
                cc.delayTime(GapTime.thirdCard),
                cc.callFunc(() => phoenixCards.setRank(phonenixResult)),
                cc.delayTime(GapTime.normal),

                cc.callFunc(() => this.showSettlementResult(data, dataResultHash, mainGame, onFinishHandlingData))
            )
        );
    }

    showSettlementResult(data: any, dataResultHash: any, mainGame: WinThreeCards, onFinishHandlingData: () => void) {
        mainGame.showScoreBoardNextDot = false;
        this.main.md5Component?.updateMD5String(dataResultHash);

        const { settlementResult } = data;
        this.showResult(settlementResult);
        this.showWinNotice(settlementResult);
        onFinishHandlingData && onFinishHandlingData();
        this.insertCurrentDataLogs(mainGame, data);

        mainGame.currentDataLogs.length > 102 && this.main.currentDataLogs.pop();
        mainGame.logsHandler.buildBasicScoreBoard(mainGame.currentDataLogs);
        mainGame.scoreboard.renderScoreBoardInGame(mainGame.currentDataLogs);
    }

    public showWinNotice(settlementResult) {
        const mainGame = this.getOwnMain();
        const winNoticeNode = mainGame.winNoticeLabel.node.parent;
        let key = "";

        if (settlementResult.dragon) {
            key = "dragon_win";
            mainGame.dragonCards.showHighlightCards();
        } else if (settlementResult.phoenix) {
            key = "phoenix_win";
            mainGame.phoenixCards.showHighlightCards();
        } else {
            key = "tie";
        }

        mainGame.winNoticeLabel.string = i18n.t(`winThreeCards.${key}`).toUpperCase();
        winNoticeNode.active = true;
    }

    protected insertCurrentDataLogs(mainGame: any, data: any) {
        if (data.winningPlayers) {
            delete data.winningPlayers;
        }

        mainGame.currentDataLogs.unshift(data);
    }
}
