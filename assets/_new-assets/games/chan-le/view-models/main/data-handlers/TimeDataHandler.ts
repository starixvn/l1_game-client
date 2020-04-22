import BaseDataHandler from "./BaseDataHandler";
import DataHandler from "../../../../../common/_base/view-models/DataHandler";
import ChanLeMain from "../ChanLeMain";
import { numberPad } from '../../../../../common/helpers/Helper';
import { ILogsDataHandler } from "./LogsDataHandler";

export interface ITimeDataHandler extends DataHandler {
    playTimeInterval: number;
    playTime(): void;
    stopPlayTime(): void;
}

export default class TimeDataHandler extends BaseDataHandler implements ITimeDataHandler {
    playTimeInterval: number;
    private readonly logsDataHandler: ILogsDataHandler;

    constructor(main: ChanLeMain, logsDataHandler: ILogsDataHandler) {
        super(main);
        this.logsDataHandler = logsDataHandler;
    }

    handle(data: any): boolean {
        if (data.time_remain) {
            this.main.isDisabled = false;
            this.main.playCenterLight();
            this.main.noticeUM.node.active = false;
            this.main.currentTimeRemaining = data.time_remain;
            this.playTime();

            return true;
        }

        return false;
    }

    playTime() {
        this.playTimeInterval && clearInterval(this.playTimeInterval);
        var self = this;

        this.playTimeInterval = setInterval(() => {
            const isInWaitTime = self.main.currentTimeRemaining > this.main.root.gameConfigs.betTime;

            if (isInWaitTime) {
                var time = numberPad(self.main.currentTimeRemaining - this.main.root.gameConfigs.betTime - 1, 2);
                self.showWaitTime(time);

                if (self.main.isNan) {
                    if (self.main.currentTimeRemaining < this.main.root.gameConfigs.nanTime) {
                        self.main.showDices(true);
                        self.main.showBetResult();
                        self.main.diaNan.node.active = false;
                    }
                }

                if (self.logsDataHandler.dataLogs) {
                    self.main.setTurnLabel(self.logsDataHandler.dataLogs[0].phien);
                }
            } else {
                self.main.resetUI();
                self.main.currentResultDices = [];
                const isStartingNewTurn = self.main.currentTimeRemaining == this.main.root.gameConfigs.betTime;
                const isInTurnTime = self.main.currentTimeRemaining > this.main.root.gameConfigs.minBetTime;

                if (self.logsDataHandler.dataLogs) {
                    self.main.setTurnLabel(self.logsDataHandler.dataLogs[0].phien + 1);
                }

                if (isStartingNewTurn) {
                    self.main.resetData();
                }

                if (isInTurnTime) {
                    var time = numberPad(self.main.currentTimeRemaining - 1, 2);
                    self.main.animatedTime.setTime(time);
                    self.main.diaNanSprite.node.active = !this.main.hideDiaNan;
                    self.main.animatedTime.node.active = true;
                } else {
                    clearInterval(self.playTimeInterval);
                }
            }
            self.main.currentTimeRemaining--;
        }, 1000);
    }

    stopPlayTime() {
        this.playTimeInterval && clearInterval(this.playTimeInterval);
    }

    private showWaitTime(time: number) {
        this.main.timeWaitNode && (this.main.timeWaitNode.active = true);
        this.main.timeWaitLabel.string = "00:" + numberPad(time, 2);
    }
}