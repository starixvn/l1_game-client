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
        const finishHandler = this.main.finishHandler as MiniKenoFinishHandler;

        if (this.main.timeHandler.isInWaitTime) {
            finishHandler.showResultWithoutAnimation();
        }
        else {
            const lastLog = dataLogs[0];
            this.main.highlightWonItem(lastLog.settlementResult, false, true);
        }
    }
}
