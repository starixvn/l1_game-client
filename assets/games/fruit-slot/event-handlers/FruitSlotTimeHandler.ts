import GameBaseTimeHandler from "../../_base/handlers/GameBaseTimeHandler";
import FruitSlot from "../view-models/FruitSlot";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: FruitSlot) {
        super(main);
    }

    handleWaitTime() {        
        this.showWaitTime();

        this.showMainTime(false);

        this.main.showProcessingWarning(false);
        this.main.setGameRound(this.main.roundId - 1);
    }

    showRoundTime() {
        super.showRoundTime();
        if (this.main.timeWaitDot) {
            this.main.timeWaitDot.active = false;
        }
    }

    showWaitTime() {
        //const timeWaitAnim = this.main.timeWaitDot.getComponent(cc.Animation);
        this.main.timeWaitDot.active = true;
        //timeWaitAnim.play();
        this.main.timeWaitNode.active = true;
        this.main.timeWaitLabel.string = this.formatTime(this.main.currentTimeRemaining - this.main.config.betTime - 1);
    }
}
