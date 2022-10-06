import GameBaseTimeHandler from "../../_base/handlers/GameBaseTimeHandler";
import FruitSlot from "../view-models/FruitSlot";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: FruitSlot) {
        super(main);
    }

    handleWaitTime() {
        super.handleWaitTime();
        this.main.timeAnimShowResult(!this.main.finishShowResult);
    }

    // handleInRoundTime() {
    //     super.handleInRoundTime();
    //     this.main.betItems.forEach((item) => (item.node.opacity = 255));
    //     this.main.spinItems.forEach((item) => item.resetHighlight());
    //     this.main.setBgVisibility(this.main.betOptionsUI.bgLockSpin, true);
    //     this.main.betOptionsUI.bigSmallResultBackground.opacity = 0;
    // }

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
}
