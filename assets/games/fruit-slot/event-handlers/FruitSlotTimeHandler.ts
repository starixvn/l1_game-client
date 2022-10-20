import GameBaseTimeHandler from "../../_base/handlers/GameBaseTimeHandler";
import FruitSlot from "../view-models/FruitSlot";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotTimeHandler extends GameBaseTimeHandler {
    isFirstJoinRoom = true;

    constructor(protected readonly main: FruitSlot) {
        super(main);
    }

    gameUpdate(): void {
        super.gameUpdate();

        if (this.main.currentTimeRemaining <= this.main.config.betTime && this.isFirstJoinRoom) {
            this.isFirstJoinRoom = false;
        }
    }

    handleWaitTime() {
        super.handleWaitTime();

        const gameRoundHistoryData = this.main.gameData.roundHistory.roundHistory[0].result;
        this.main.timeAnimShowResult(!this.main.finishShowResult);
        this.main.setBgVisibility(this.main.betOptionsUI.bgLockSpin, false);
        this.main.betOptionsUI.lightAnimation.node.active = false;

        if (this.isFirstJoinRoom) {
            this.isFirstJoinRoom = false;
            this.showLastRoundResult(gameRoundHistoryData, false);
        }
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.betOptionsUI.resetUIBettingZone();
    }

    showWaitTime() {
        this.main.timeWaitNode.active = true;
        this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.main.config.betTime - 1);
    }

    handleInLockBetTime() {
        this.main.statistic.addNextItemHistory();
    }

    showLastRoundResult(resultData: any, isAnimated: boolean) {
        const listSymbolWin = resultData.symbols;
        const bigSmallWin = resultData.number > 7 ? "big" : "small";
        this.main.betOptionsUI.highlightWinningSymbol(bigSmallWin, isAnimated);
        console.log("showLastRoundResultttt", resultData.symbolPositions);
        this.main.betOptionsUI.bigSmallResult.string = this.main.betOptionsUI.formatBigSmallResult(resultData.number);

        for (let i = 0; i <= listSymbolWin.length; i++) {
            const winSymbol = this.main.betOptionsUI.getWinningOption(listSymbolWin[i]);
            this.main.betOptionsUI.highlightWinningSymbol(winSymbol, isAnimated);
        }

        for (let i = 0; i <= resultData.symbolPositions.length; i++) {
            const symbolPositions = resultData.symbolPositions[i];
            console.log("resultData.symbolPositions", resultData.symbolPositions);
            //this.main.betOptionsUI.spinItems[symbolPositions]?.setHighlightItems(true, false);
        }
    }
}
