import MiniKeno from "../MiniKeno";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import MiniKenoTimeHandler from "./MiniKenoTimeHandler";

export default class MiniKenoFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: MiniKeno) {
        super(main, 2);
    }

    handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHanlingData);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();

        if (cc.RedT.GAME_IS_SHOWED) {
            this.main.node.runAction(cc.sequence(
                cc.callFunc(() => this.playResultAnimation()),
                cc.delayTime(this.playResultAnimationTime),
                cc.callFunc(() => onFinishHanlingData())
            ));
        }
    }

    playResultAnimation() {
        var resultNumbers = this.main.currentDataLogs[0].result;
        this.main.resultAnimating = true;
        this.main.roundResult.setData(resultNumbers, this.main.currentDataLogs[0].settlementResult);
        this.main.roundResult.show(true, this.playResultAnimationTime, () => {
            this.main.resultAnimating = false;
            var handler = this.main.timeHandler as MiniKenoTimeHandler;
            handler.showResult(true);
        });
    }
}
