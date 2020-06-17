import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import MiniKeno from "../../../mini-keno/view-models/MiniKeno";

export default class MiniKenoProVietLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    handle(data: any): boolean {
        if (data.roundHistory) {
            this.main.currentDataLogs = data.roundHistory.shift();
        }

        super.handle(data);
        return true;
    }

    buildLogs(dataLogs) {
        this.main.updateRoundHistory();
    }
}
