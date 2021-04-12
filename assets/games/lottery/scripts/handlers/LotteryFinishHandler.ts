import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Lottery from "../Lottery";

export default class LotteryFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: Lottery) {
        super(main);
    }

    handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        if (cc.RedT.GAME_IS_SHOWED) {
            this.main.showResult(dataFinish).then(() => {
                onFinishHanlingData();
            });
        } else {
            this.main.updateAfterResult();
        }
    }
}
