import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import MiniKeno from "../MiniKeno";

export default class MiniKenoLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    buildLogs(dataLogs) {
        this.main.updateRoundHistory();
    }
}
