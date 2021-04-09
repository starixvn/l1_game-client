import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import Lottery from "../Lottery";

export default class LotteryLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: Lottery) {
        super(main);
    }

    buildLogs(dataLogs) {
        if (this.main.timeHandler.isInWaitTime && this.main.currentTimeRemaining > this.main.config.betTime) {
            this.main.showResultDialog();
            this.main.setResult(dataLogs[0], false);
            this.main.highlightLastResult();
        }
        this.main.updateLastResult();
        this.main.updateMiniRoundHistories();
    }
}
