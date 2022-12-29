import BaccaratFinishHandler from "../../../baccarat/view-models/data-handlers/BaccaratFinishHandler";
import WinThreeCards from "../WinThreeCards";
import { i18n } from "../../../../ClientModules";
import { WinThreeCardsResult, WinThreeCardsSettlementResult } from "../WinThreeCardsModel";
import { Choices } from "../WinThreeCardsConstant";
import { StringHelper } from "../WinThreeCardsHelper";

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
        mainGame.dragonCards.cardResult = new WinThreeCardsResult(dragon);
        mainGame.phoenixCards.cardResult = new WinThreeCardsResult(phoenix);

        const { dragonCards, phoenixCards } = mainGame;
        cc.tween(mainGame.node)
            .call(() => dragonCards.showFirstTwoCards())
            .delay(GapTime.normal)
            .call(() => phoenixCards.showFirstTwoCards())
            .delay(GapTime.normal)
            .call(() => dragonCards.showLastCard())
            .delay(GapTime.thirdCard)
            .call(() => dragonCards.setRank())
            .delay(GapTime.normal)
            .call(() => phoenixCards.showLastCard())
            .delay(GapTime.thirdCard)
            .call(() => phoenixCards.setRank())
            .delay(GapTime.normal)
            .call(() => this.showSettlementResult(data, dataResultHash, mainGame, onFinishHandlingData))
            .start();
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

    public showWinNotice(settlementResult: WinThreeCardsSettlementResult) {
        const mainGame = this.getOwnMain();
        let key = StringHelper.Tie;

        if (settlementResult.dragon) {
            key = `${Choices.dragon}_${StringHelper.Win}`;
            mainGame.dragonCards.showHighlightCards();
        } else if (settlementResult.phoenix) {
            key = `${Choices.phoenix}_${StringHelper.Win}`;
            mainGame.phoenixCards.showHighlightCards();
        }

        mainGame.winNoticeLabel.string = i18n.t(`${StringHelper.winThreeCardsNameSpace}.${key}`).toUpperCase();
        mainGame.winNoticeLabel.node.parent.active = true;
    }
}
