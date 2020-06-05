import BaseDataHandler from "./BaseDataHandler";
import DataHandler from "../../../../_base/handlers/DataHandler";
import ChanLeLogTips from "../ChanLeLogTips";
import ChanLeMain from "../ChanLeMain";

export interface ILogsDataHandler extends DataHandler {
    dataLogs: any;
    dotLogs: ChanLeLogTips[];
    updateDataLogs(data: any): void;
    initDotLogs(): void;
    buildDotLogs(dataLogs: any): void;
}

export default class LogsDataHandler extends BaseDataHandler implements ILogsDataHandler {
    dotLogs: ChanLeLogTips[];
    dataLogs: any;

    constructor(main: ChanLeMain) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.logs) {
            return false;
        }

        this.dataLogs = data.logs;
        this.main.currentResultDices = [...data.logs[0].dice];

        if (this.main.currentTimeRemaining > this.main.root.gameConfigs.betTime && !this.main.isDisabled) {
            this.main.showDices(true);
            this.main.showBetResult();
        }

        this.buildDotLogs(this.dataLogs);

        if (this.main.root.statistics) {
            this.main.root.statistics.drawStatistics();
        }

        return true;
    }

    updateDataLogs(data: any) {
        if (!this.dataLogs) {
            return;
        }
        this.dataLogs.unshift({
            dice: [
                data.finish.dices[0],
                data.finish.dices[1],
                data.finish.dices[2]
            ],
            phien: data.finish.phien
        });

        this.dataLogs.length > 120 && this.dataLogs.pop();
        this.buildDotLogs(this.dataLogs);
    }

    initDotLogs() {
        Promise.all(this.main.dotLogs.children.map((dot) => {
            return dot.getComponent("ChanLeLogTips") as ChanLeLogTips;
        })).then(result => {
            this.dotLogs = result;
        });
    }

    buildDotLogs(dataLogs: any) {
        if (!dataLogs || !dataLogs.length) {
            return;
        }

        var self = this;
        console.log(dataLogs);
        Promise.all(self.dotLogs.map(function (dotLog, index) {
            var data = dataLogs[index];

            if (data) {
                var point = data.dice[0] + data.dice[1] + data.dice[2];
                dotLog.node.active = true;
                dotLog.text.string = `${point % 2 ? "LẼ" : "CHẴN"} (${data.dice[0]}-${data.dice[1]}-${data.dice[2]})`;
                if (dotLog.round) {
                    dotLog.round.string = `#${data.phien}`;
                }

                dotLog.sprite.spriteFrame = point % 2
                    ? self.main.dotWhite
                    : self.main.dotBlack;
            } else {
                dotLog.node.active = false;
            }
        }));
    }
}