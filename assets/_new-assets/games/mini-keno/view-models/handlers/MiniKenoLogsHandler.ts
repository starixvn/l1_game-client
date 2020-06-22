import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import MiniKeno from "../MiniKeno";
import MiniKenoFinishHandler from "./MiniKenoFinishHandler";

export default class MiniKenoLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    buildLogs(dataLogs) {
        this.main.updateRoundHistory();

        const finishHandler = this.main.finishHandler as MiniKenoFinishHandler;

        if (this.main.timeHandler.isInWaitTime) {
            finishHandler.showResult();
        } else if (this.main.timeHandler.isInLockBetTime) {
            this.main.roundResult.clear();
        }
        else {
            const lastLog = dataLogs[0];
            finishHandler.highlightWonItem(lastLog.settlementResult, false);
            this.main.roundResult.setData(lastLog.result, lastLog.settlementResult);
            this.main.roundResult.show(false);
        }

    }
}
