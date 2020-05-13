import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Keno from "../Keno";

export default class KenoFinishHandler extends GameBaseFinishHandler {

    constructor(protected readonly main: Keno) {
        super(main, 2);
    }

    handleFinishData(dataFinish) {
        super.handleFinishData(dataFinish);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.main.roundId = dataFinish.roundId;

        if (cc.RedT.GAME_IS_SHOWED) {
            this.playResultAnimation();
        }
    }

    playResultAnimation() {
        var resultNumbers = this.main.currentDataLogs[0].result;
        this.main.resultAnimating = true;
        this.main.roundResult.setData(resultNumbers, this.main.currentDataLogs[0].settlementResult);
        this.main.roundResult.show(true, this.playResultAnimationTime, () => {
            this.main.resultAnimating = false;
        });
    }
}
