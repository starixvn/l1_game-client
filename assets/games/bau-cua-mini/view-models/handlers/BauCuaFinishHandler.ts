import { trim } from "lodash";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import BauCua from "../BauCua";

export default class BauCuaFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: BauCua) {
        super(main, 2.5);
    }

    handleFinishData(dataFinish, onFinishHandlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHandlingData);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.main.setDiceResult();

        if (cc.RedT.GAME_IS_SHOWED) {
            cc.tween(this.main.node)
                .call(this.openDisk.bind(this))
                .delay(0.1)
                .call(() => this.main.showDiceResult(true))
                .delay(1)
                .call(() => {
                    onFinishHandlingData();
                    this.main.highlightWinningBetItems(true);
                    this.main.addLogs();
                })
                .start();
        }
    }

    handleAnimation() {
        this.main.animationNode.node.active = true;
        this.main.animationNode.play();
    }

    openDisk() {
        this.main.shakeAnimation.node.active = false;
        this.main.thePlate.active = true;
        this.main.openDiskAnimation.play();
    }
}
