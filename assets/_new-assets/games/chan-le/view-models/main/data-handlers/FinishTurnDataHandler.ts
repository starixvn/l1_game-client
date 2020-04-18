import BaseDataHandler from "./BaseDataHandler";
import DataHandler from "../../../../../common/_base/view-models/DataHandler";
import ChanLeMain from "../ChanLeMain";
import { ITimeDataHandler } from "./TimeDataHandler";
import { ILogsDataHandler } from "./LogsDataHandler";

export default class FinishTurnDataHandler extends BaseDataHandler implements DataHandler {
    private readonly timeDataHandler: ITimeDataHandler;
    private readonly logsDataHandler: ILogsDataHandler;

    constructor(main: ChanLeMain, timeDataHandler: ITimeDataHandler, logsDataHandler: ILogsDataHandler) {
        super(main);
        this.timeDataHandler = timeDataHandler;
        this.logsDataHandler = logsDataHandler;
    }

    handle(data: any) {
        if (!data.finish) {
            return;
        }

        this.timeDataHandler.stopPlayTime();
        this.logsDataHandler.updateDataLogs(data);
        this.main.currentResultDices = [...data.finish.dices];

        if (this.main.isNan) {
            this.main.diaNan.node.active = true;
            this.main.diaNan.node.position = cc.v2(0, -11.5);
            this.main.diaNanSprite.node.active = false;
            this.main.onDiceAnimationFinished();
        } else {
            this.main.diceAnimation.node.active = true;
            this.main.diceAnimation.play();
        }

        this.main.timeWaitNode.active = true;
        this.main.animatedTime.node.active = false;
        this.main.currentTimeRemaining = this.main.root.gameConfigs.betTime + this.main.root.gameConfigs.waitTime;
        this.timeDataHandler.playTime();
    }

}