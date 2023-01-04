import BaccaratFinishHandler from "../../../baccarat/view-models/data-handlers/BaccaratFinishHandler";
import WinThreeCards from "../WinThreeCards";
import { i18n } from "../../../../ClientModules";
import { WinThreeCardsResult, WinThreeCardsSettlementResult } from "../WinThreeCardsModel";
import { Choices } from "../WinThreeCardsConstant";
import { StringHelper } from "../WinThreeCardsHelper";
import WebSocketTableGameBase from "../../../_base/WebSocketTableGameBase";
import { updateOtherPlayerBalance } from "../../../_base/action/OtherPlayerAction";
import { payChips, payoutLoginPlayer, showWinningEffectForPlayers } from "../../../_base/action/PayChipsAction";
import WinThreeCardsTimeDataHandler from "./WinThreeCardsTimeDataHandler";

export const GapTime = {
    normal: 0.8,
    thirdCard: 1
};

export default class WinThreeCardsFinishHandler extends BaccaratFinishHandler {
    private winningPlayers = {};

    protected clearWinningPlayers() {
        this.winningPlayers = {};
    }

    protected getOwnTimeHandle(): any {
        return this.getOwnMain().timeHandler as WinThreeCardsTimeDataHandler;
    }
    handle(data): boolean {
        if (data.finish) {
            this.main.finishShowResult = false;
            this.main.node.activeInHierarchy && this.main.gameAudios.playEndGameAudio();
            this.setNewGameRound(data);
            const mainRoomGame = this.main as WebSocketTableGameBase;
            if (mainRoomGame && mainRoomGame.playerHandler) {
                updateOtherPlayerBalance(this.winningPlayers, this.main);
            }
            this.handleFinishData(data.finish, data.resultHash, () => {
                payChips(this.main, data.finish.settlementResult, this.winningPlayers, this.payChipFlyTime, this.WinningAnimationDuration);
                this.main.finishShowResult = true;
                this.clearWinningPlayers();
            });
        }

        if (data.winners) {
            this.winningPlayers = data.winners?.winningPlayers;
            if (this.getOwnTimeHandle().isInWaitTime && this.main.finishShowResult) {
                showWinningEffectForPlayers(this.main, this.winningPlayers);
                this.clearWinningPlayers();
            }
        }

        if (data.status) {
            if (this.getOwnTimeHandle().isInWaitTime && this.main.finishShowResult) {
                payoutLoginPlayer(this.main, data.status);
            }
        }
        return true;
    }

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
