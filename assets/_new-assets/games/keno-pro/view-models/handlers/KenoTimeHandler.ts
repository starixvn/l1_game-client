import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import Keno from "../Keno";

export default class KenoTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: Keno) {
        super(main);
    }

    handleWaitTime() {
        super.handleWaitTime();

        if (!this.main.resultAnimating) {
            this.showResult(true);
        }

        if (this.main.currentTimeRemaining > this.main.config.betTime + 6) {
            this.main.timeWaitNode.active = false;
        }
    }

    handleInRoundTime() {
        super.handleInRoundTime();

        this.main.resultAnimating = false;
        this.showResult(false);
    }

    showResult(show: boolean) {
        if (show) {
            this.main.updateRoundHistory();
            this.main.setGameRound(this.main.roundId);

            if (this.main.currentDataLogs.length > 0) {
                this.main.roundResult.setData(this.main.currentDataLogs[0].result, this.main.currentDataLogs[0].settlementResult);
                this.main.roundResult.show(false);

                var results = this.main.getResults(this.main.currentDataLogs[0].settlementResult);
                this.highlightWonItem(true, results);
            }
        } else {
            this.main.setGameRound(this.main.roundId + 1);
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
