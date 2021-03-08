import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import BauCua from "../BauCua";

export default class BauCuaLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: BauCua) {
        super(main);
    }

    buildLogs(dataLogs) {}
}
