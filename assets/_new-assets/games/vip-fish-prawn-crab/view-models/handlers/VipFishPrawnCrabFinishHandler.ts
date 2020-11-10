import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import VipFishPrawnCrab from "../VipFishPrawnCrab";

export default class VipFishPrawnCrabFinishHandler extends GameBaseFinishHandler {

    constructor(protected readonly main: VipFishPrawnCrab) {
        super(main, 3);
    }

    handleFinishData(dataFinish, onFinishHandlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHandlingData);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.main.setResult();

        cc.tween(this.main.node)
            .call(() => {
                this.main.shakeAnimation.node.active = false;
                this.main.openDiskAnimation.node.active = true;
                this.main.openDiskAnimation.play();
            })
            .delay(this.playResultAnimationTime)
            .call(() => {
                onFinishHandlingData();
                this.main.updateStats();
            })
            .start();
    }
}