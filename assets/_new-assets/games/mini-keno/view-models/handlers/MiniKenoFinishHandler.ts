import MiniKeno from "../MiniKeno";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import { getLowercaseObjectKeys } from "../../../../common/helpers/Helper";
import MiniKenoStatusHandler from "./MiniKenoStatusHandler";

export default class MiniKenoFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: MiniKeno) {
        super(main, 5);
    }

    handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHanlingData);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.handleResult(onFinishHanlingData);
        this.main.stopBetWarning.active = false;
    }

    protected handleResult(onFinishHanlingData: () => void) {
        if (cc.RedT.GAME_IS_SHOWED) {
            this.main.node.runAction(cc.sequence(
                cc.callFunc(() => {
                    this.main.stopBetWarning.active = false;
                    this.playResultAnimation();
                }),
                cc.delayTime(this.playResultAnimationTime),
                cc.callFunc(() => onFinishHanlingData())
            ));
        }
    }

    private playResultAnimation() {
        var resultNumbers = this.main.currentDataLogs[0].result;
        this.main.roundResult.setData(resultNumbers, this.main.currentDataLogs[0].settlementResult);
        this.main.roundResult.show(true, this.playResultAnimationTime, () => {
            this.showResult();
        });
    }

    showResult() {
        this.main.updateRoundHistory();

        const statusData = this.main.statusHandler.currentStatusData;
        if (statusData) {
            const miniStatuHander = this.main.statusHandler as MiniKenoStatusHandler;
            miniStatuHander.showStatus(statusData.win, statusData.bet);
            this.main.statusCallback(this.main.kenoType, this.main.roundId, statusData.bet);
        }

        if (this.main.currentDataLogs.length > 0) {
            this.main.roundResult.setData(this.main.currentDataLogs[0].result, this.main.currentDataLogs[0].settlementResult);
            this.main.roundResult.show(false);
            this.highlightWonItem(this.main.currentDataLogs[0].settlementResult);
        }
    }

    highlightWonItem(results: any = null, isAnimated = true) {
        const keys = getLowercaseObjectKeys(results);
        this.main.betItems.forEach(item => item.setHighlight(results[keys[item.node.name.toLowerCase()]], isAnimated));
    }
}
