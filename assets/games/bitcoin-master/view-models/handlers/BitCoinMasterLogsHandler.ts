import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import BitcoinMaster from "../BitcoinMaster";

export default class BitcoinMasterLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: BitcoinMaster) {
        super(main);
    }

    buildLogs(dataLogs) {
        if (dataLogs && dataLogs[0] && dataLogs[0].result) {
            this.main.setResult(dataLogs[0].result);
        }
        // this.main.updateRoundHistory();
        // this.main.statistic && this.main.statistic.setData(dataLogs);
    }
}
