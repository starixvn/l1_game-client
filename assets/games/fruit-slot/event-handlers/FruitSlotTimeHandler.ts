import GameBaseTimeHandler from "../../_base/handlers/GameBaseTimeHandler";
import FruitSlot from "../view-models/FruitSlot";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: FruitSlot) {
        super(main);
    }

    get isInWaitTime() {
        return this.main.currentTimeRemaining > this.main.config.betTime;
    }

    handleWaitTime() {
        super.handleWaitTime();
    }

    gameUpdate(): void {
        if (this.isInWaitTime) {
            this.handleWaitTime();
        }
        this.main.currentTimeRemaining--;
    }

    handeWaitTime() {
        //const gameData = this.main.gameData;
        this.showMainTime(false);
        this.main.showProcessingWarning(false);
        this.main.setGameRound(this.main.roundId - 1);
    }

    showWaitTime() {
        
    }
}
