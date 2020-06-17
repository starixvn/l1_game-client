import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import MiniKenoProViet from "../MiniKenoProViet";
import MiniKenoLogsHandler from "../../../mini-keno/view-models/handlers/MiniKenoLogsHandler";

export default class MiniKenoProVietLogsHandler extends MiniKenoLogsHandler {
    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    buildLogs(dataLogs) {
        super.buildLogs(dataLogs);
    }
}
