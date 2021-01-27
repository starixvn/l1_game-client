import DataHandler from "../../../../_base/handlers/DataHandler";
import ChanLeMain from "../ChanLeMain";
import BaseDataHandler from "./BaseDataHandler";
import { ILogsDataHandler } from "./LogsDataHandler";
import { ITimeDataHandler } from "./TimeDataHandler";

export default class FinishTurnDataHandler extends BaseDataHandler implements DataHandler {
    private readonly timeDataHandler: ITimeDataHandler;
    private readonly logsDataHandler: ILogsDataHandler;

    constructor(main: ChanLeMain, timeDataHandler: ITimeDataHandler, logsDataHandler: ILogsDataHandler) {
        super(main);
        this.timeDataHandler = timeDataHandler;
        this.logsDataHandler = logsDataHandler;
    }

    handle(data: any): boolean {
        if (!data.finish) {
            return false;
        }

        this.timeDataHandler.stopPlayTime();
        this.logsDataHandler.updateDataLogs(data);
        this.main.currentResultDices = [...data.finish.dices];

        this.main.animatedTime.node.active = false;
        this.main.currentTimeRemaining = this.main.root.gameConfigs.betTime + this.main.root.gameConfigs.waitTime;
        this.timeDataHandler.playTime();

        return true;
    }
}
