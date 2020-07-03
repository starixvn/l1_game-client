import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import MiniKeno from "../MiniKeno";
import MiniKenoFinishHandler from "./MiniKenoFinishHandler";

export default class MiniKenoLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    buildLogs(dataLogs) {
        if (!dataLogs || dataLogs.length == 0) {
            return;
        }

        this.main.updateRoundHistory();

        if (this.main.timeHandler.isInWaitTime) {
            this.handleInWaitingTime();
        }
        else {
            const lastLog = dataLogs[0];
            this.main.highlightWonItem(lastLog.settlementResult, { isAnimated: false, showWinningEffect: true });
        }
    }

    protected handleInWaitingTime() {
        const finishHandler = this.main.finishHandler as MiniKenoFinishHandler;
        finishHandler.showResultWithoutAnimation();
    }
}
