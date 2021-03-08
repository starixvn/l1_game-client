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
                .call(this.handleAnimation.bind(this))
                .delay(this.playResultAnimationTime)
                .call(() => {
                    onFinishHandlingData();
                    this.main.highlightWinningBetItems();
                    this.main.addLogs();
                })
                .start();
        }
    }

    handleAnimation() {
        this.main.animationNode.node.active = true;
        const duration = this.main.animationNode.defaultClip.duration;
        this.main.animationNode.play("BauCua_plate", duration - 1);
    }
}
