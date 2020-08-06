import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Roulette from "../Roulette";

export default class RouletteFinishHandler extends GameBaseFinishHandler {

    constructor(protected readonly main: Roulette) {
        super(main, 2);
    }

    public handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHanlingData);
        this.main.showWheelResult(dataFinish.result, () => {
            this.main.currentDataLogs.unshift(dataFinish);
            this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
            this.main.updateMiniRoundResult(true);
            this.main.finishShowResult = true;
        });
    }
}
