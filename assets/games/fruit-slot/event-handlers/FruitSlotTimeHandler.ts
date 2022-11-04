import GameBaseTimeHandler from "../../_base/handlers/GameBaseTimeHandler";
import {
    formatBigSmallResult,
    getWinningOption,
    highlightWinningSymbol,
    setBgVisibility,
    showHighlightBet
} from "../actions/FruitSlotWinningAction";
import FruitSlot from "../view-models/FruitSlot";
import { FruitSlotResult } from "../FruitSlotType";

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
        setBgVisibility(this.main.betOptionsUI.bgLockSpin, false);        

        if (this.isFirstJoinRoom) {
            this.isFirstJoinRoom = false;
            this.showLastRoundResult(gameRoundHistoryData, false);
        }
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.betOptionsUI.resetUIBettingZone();
        this.main.countdownLightAnim(true);
        this.main.betOptionsUI.playBettingAnim(true);
    }

    showWaitTime() {
        this.main.timeWaitNode.active = true;
        this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.main.config.betTime - 1);  
    }

    handleInRoundTime() {
        super.handleInRoundTime();
        setBgVisibility(this.main.betOptionsUI.bgLockSpin, true, false);
        this.main.countdownLightAnim(true);
        this.main.betOptionsUI.playBettingAnim(true);
    }

    handleInLockBetTime() {
        this.main.miniRoundHistory.addNextItemHistory();
        this.main.statistic.addNextItemHistory();
        this.main.betItems.forEach((item) => item.setHighlight(false));
        this.main.countdownLightAnim(false);
        this.main.betOptionsUI.playBettingAnim(false);        
    }

    showLastRoundResult(resultData: any, isAnimated: boolean) {
        const listSymbolWin = resultData.symbols;
        const bigSmallWin = resultData.number > 7 ? "big" : "small";
        highlightWinningSymbol(this.main.betOptionsUI)(bigSmallWin, isAnimated);
        this.main.betOptionsUI.bigSmallResult.string = formatBigSmallResult(resultData.number);

        for (let i = 0; i <= listSymbolWin.length; i++) {
            const winSymbol = getWinningOption(listSymbolWin[i]);
            highlightWinningSymbol(this.main.betOptionsUI)(winSymbol, isAnimated);
        }

        for (let i = 0; i <= resultData.symbolPositions.length; i++) {
            const symbolPositions = resultData.symbolPositions[i];
            this.main.betOptionsUI.spinItems[symbolPositions]?.setHighlightSpinItem(true);
        }
    }

    resetNewTime(result: FruitSlotResult) {
        const durationLucky = 4;
        super.resetTime();
        result.isLucky && (this.main.currentTimeRemaining = this.main.config.fullTime + durationLucky * result.symbols.length);
    }

    handleInEndTime() {
        super.handleInEndTime();
        this.main.timeAnimShowResult(true);
        this.main.finishShowResult = false;
    }

    showRoundTime() {
        super.showRoundTime();
        this.main.timeAnimShowResult(false);
        this.main.finishShowResult = false;
    }
}
