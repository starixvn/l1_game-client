import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import MiniKeno from "../MiniKeno";
import Keno from "../../../keno-pro/view-models/Keno";
import { numberPad } from "../../../../common/helpers/Helper";

export default class MiniKenoTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: MiniKeno) {
        super(main);
    }

    handleWaitTime() {
        super.handleWaitTime();
        this.main.stopBetWarning.active = false;
        this.main.animatedTime.setTime(this.main.currentTimeRemaining.toString());

        if (!this.main.resultAnimating) {
            this.showResult(true);
        }
    }

    handleInRoundTime() {
        super.handleInRoundTime();

        this.main.resultAnimating = false;
        this.showResult(false);
        if (this.main.lastBetInfo) {
            this.main.enableRebetButton(true);
        }
    }

    public showResult(show: boolean) {
        if (show) {
            this.main.animatedTime.node.active = false;

            this.main.updateRoundHistory();

            if (this.main.currentDataLogs.length > 0) {
                this.main.roundResult.setData(this.main.currentDataLogs[0].result, this.main.currentDataLogs[0].settlementResult);
                this.main.roundResult.show(false);

                var results = Keno.getResults(this.main.currentDataLogs[0].settlementResult);
                this.highlightWonItem(true, results);
            }

            if (this.main.currentTimeRemaining < this.main.config.betTime + 2) {
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

    handleInLockBetTime() {
        super.handleInLockBetTime();

        this.main.stopBetWarning.active = true;
        this.main.betItems.forEach(item => item.setHighlight(false));
        this.main.betBoard.close();
        this.main.enableRebetButton(false);
    }
}
