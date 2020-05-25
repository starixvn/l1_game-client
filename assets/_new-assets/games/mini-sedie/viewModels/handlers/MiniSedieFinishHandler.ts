import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler"
import MiniSedie from "../MiniSedie";

export default class MiniSedieFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: MiniSedie) {
        super(main, 3);
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
        this.main.setDots(this.main.currentDataLogs[0].result);
    }
}