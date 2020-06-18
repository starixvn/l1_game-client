import MiniKeno from "../MiniKeno";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import { getLowercaseObjectKeys } from "../../../../common/helpers/Helper";

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
        this.main.stopBetWarning.active = false;
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

        if (this.main.currentDataLogs.length > 0) {
            this.main.roundResult.setData(this.main.currentDataLogs[0].result, this.main.currentDataLogs[0].settlementResult);
            this.main.roundResult.show(false);
            this.highlightWonItem(true, this.main.currentDataLogs[0].settlementResult);
        }
    }

    highlightWonItem(highlight: boolean, results: any = null, isAnimated = true) {
        if (highlight) {
            const keys = getLowercaseObjectKeys(results);
            this.main.betItems.forEach(item => item.setHighlight(results[keys[item.node.name.toLowerCase()]], isAnimated));

        } else {
            this.main.betItems.forEach(item => item.resetHighlight());
        }
    }
}
