import MiniKenoLogsHandler from "../../../mini-keno/view-models/handlers/MiniKenoLogsHandler";
import MiniKenoProViet from '../MiniKenoProViet';

export default class MiniKenoProVietLogsHandler extends MiniKenoLogsHandler {
    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    protected handleInWaitingTime() {
        if (this.main.isInLastRoundOfDay(this.main.currentTimeRemaining)) {
            const lastLog = this.main.currentDataLogs[0];
            this.main.highlightWonItem(lastLog.settlementResult, { isAnimated: false, showWinningEffect: true });
        }
        else {
            super.handleInWaitingTime();
        }
    }
}
