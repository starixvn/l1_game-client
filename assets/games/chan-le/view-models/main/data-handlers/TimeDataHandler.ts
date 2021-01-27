import { numberPad } from "../../../../../common/helpers/NumberHelper";
import DataHandler from "../../../../_base/handlers/DataHandler";
import ChanLeMain from "../ChanLeMain";
import BaseDataHandler from "./BaseDataHandler";
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

        this.playTimeInterval = setInterval(() => {
            const isInWaitTime = this.main.currentTimeRemaining > this.main.root.gameConfigs.betTime;

            if (isInWaitTime) {
                this.handleInWaitTime();
            } else {
                this.handleInRoundTime();
            }
            this.main.currentTimeRemaining--;
        }, 1000);
    }

    handleInWaitTime() {
        const isBalanceBetTime = this.main.currentTimeRemaining > this.main.root.gameConfigs.displayResultTime;
        if (isBalanceBetTime) {
            this.main.balanceBet(this.main.currentTimeRemaining === this.main.root.gameConfigs.fullTime);
        } else {
            this.main.hideBetBalanceNotice();
            this.main.enableHistoryButton();
            if (this.main.currentTimeRemaining === this.main.root.gameConfigs.displayResultTime) {
                this.main.showResult();
                this.main.currentStatus && this.main.showUserWinLoss(this.main.currentStatus);
            }

            const time = this.main.currentTimeRemaining - this.main.root.gameConfigs.betTime - 1;
            this.showWaitTime(time);

            if (this.main.isNan) {
                if (this.main.currentTimeRemaining < this.main.root.gameConfigs.nanTime) {
                    this.main.showDices(true);
                    this.main.showBetResult();
                    this.main.diaNan.node.active = false;
                }
            }

            if (this.logsDataHandler.dataLogs) {
                this.main.setTurnLabel(this.logsDataHandler.dataLogs[0].phien);
            }
        }
    }

    handleInRoundTime() {
        this.main.resetUI();
        this.main.currentResultDices = [];
        this.main.currentStatus = null;
        const isStartingNewTurn = this.main.currentTimeRemaining === this.main.root.gameConfigs.betTime;
        const isInTurnTime = this.main.currentTimeRemaining > this.main.root.gameConfigs.minBetTime;

        if (this.logsDataHandler.dataLogs) {
            this.main.setTurnLabel(this.logsDataHandler.dataLogs[0].phien + 1);
        }

        if (isStartingNewTurn) {
            this.main.gameAudios.playStartGameAudio();
            this.main.resetData();
        }

        if (isInTurnTime) {
            const time = numberPad(this.main.currentTimeRemaining - 1, 2);
            this.main.animatedTime.setTime(time);
            this.main.diaNanSprite.node.active = !this.main.hideDiaNan;
        } else {
            this.main.disableHistoryButton();
            clearInterval(this.playTimeInterval);
        }
    }

    stopPlayTime() {
        this.playTimeInterval && clearInterval(this.playTimeInterval);
    }

    private showWaitTime(time: number) {
        if (this.main.timeWaitNode) {
            this.main.timeWaitNode.active = true;
            this.main.timeWaitLabel.string = `00:${numberPad(time, 2)}`;
        }
    }
}
