import BaccaratFinishHandler from "../../../baccarat/view-models/data-handlers/BaccaratFinishHandler";
import WinThreeCards from "../WinThreeCards";
import { i18n } from "../../../../ClientModules";
import { WinThreeCardResult, WinThreeCardsSettlementResult } from "../WinThreeCardsModel";
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
        mainGame.dragonCards.cardResult = new WinThreeCardResult(dragon);
        mainGame.phoenixCards.cardResult = new WinThreeCardResult(phoenix);

        const { dragonCards, phoenixCards } = mainGame;
        mainGame.node.runAction(
            cc.sequence(
                cc.callFunc(() => dragonCards.showFirstTwoCards()),
                cc.delayTime(GapTime.normal),
                cc.callFunc(() => phoenixCards.showFirstTwoCards()),
                cc.delayTime(GapTime.normal),
                cc.callFunc(() => dragonCards.showLastCard()),
                cc.delayTime(GapTime.thirdCard),
                cc.callFunc(() => dragonCards.setRank()),
                cc.delayTime(GapTime.normal),
                cc.callFunc(() => phoenixCards.showLastCard()),
                cc.delayTime(GapTime.thirdCard),
                cc.callFunc(() => phoenixCards.setRank()),
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
