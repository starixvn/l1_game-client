import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Keno from "../Keno";

export default class KenoFinishHandler extends GameBaseFinishHandler {

    constructor(protected readonly main: Keno) {
        super(main);
    }

    handleFinishData(dataFinish) {
        super.handleFinishData(dataFinish);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.main.roundId = dataFinish.roundId;

        if (cc.RedT.GAME_IS_SHOWED) {
            this.main.playResultAnimation();
        }
    }
}
