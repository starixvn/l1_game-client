import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import VipFishPrawnCrab from "../VipFishPrawnCrab";

export default class VipFishPrawnCrabLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: VipFishPrawnCrab) {
        super(main);
    }

    buildLogs(dataLogs) {
        this.main.updateStats();
    }
}