import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniKeno from "../MiniKeno";
import Keno from "../../../keno-pro/view-models/Keno";
import { numberPad } from "../../../../common/helpers/Helper";

export default class MiniKenoTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    handleWaitTime() {

        this.main.animatedTime.node.active = false;
        this.main.showProcessingWarning(false);
        this.main.setGameRound(this.main.roundId);

        if (!this.main.resultAnimating) {
            this.showResult(true);
        }
    }

    handleInRoundTime() {
        this.main.timeWaitNode.active = true;
        this.main.animatedTime.node.active = false;
        var time = numberPad(this.main.currentTimeRemaining, 2);
        const isStopSoon = this.main.currentTimeRemaining < this.main.config.stopBetTime + 1;
        const prefix = isStopSoon ? "Dừng cược trong:" : "Thời gian cược:";
        const color = isStopSoon ? cc.Color.RED : cc.Color.WHITE;
        this.main.timeWaitLabel.string = `${prefix} ${time}`;
        this.main.timeWaitLabel.node.color = color;
        this.main.setGameRound(this.main.roundId + 1);
        this.main.resultAnimating = false;
        this.showResult(false);
    }

    public showResult(show: boolean) {
        if (show) {
            this.main.timeWaitNode.active = true;
            this.main.timeWaitLabel.string = `Công bố kết quả`;
            this.main.timeWaitLabel.node.color = cc.Color.WHITE;

            this.main.updateRoundHistory();

            if (this.main.currentDataLogs.length > 0) {
                this.main.roundResult.setData(this.main.currentDataLogs[0].result, this.main.currentDataLogs[0].settlementResult);
                this.main.roundResult.show(false);

                var results = Keno.getResults(this.main.currentDataLogs[0].settlementResult);
                this.highlightWonItem(true, results);
            }

            if (this.main.currentTimeRemaining < this.main.config.betTime + 8) {
                this.main.roundResult.node.active = false;
            }
        } else {
            this.highlightWonItem(false);
            this.main.roundResult.node.active = false;
        }
    }

    highlightWonItem(highlight: boolean, results: string[] = []) {
        if (highlight) {
            this.main.betItems.forEach(item => {
                var exist = results.indexOf(item.node.name);
                item.setHighlight(exist > -1);
            });
        } else {
            this.main.betItems.forEach(item => item.resetHighlight());
        }
    }
}
