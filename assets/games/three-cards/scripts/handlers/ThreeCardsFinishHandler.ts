import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import ThreeCards from "../ThreeCards";

export default class ThreeCardsFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: ThreeCards) {
        super(main);
    }

    handleFinishData(dataFinish, onFinishHandlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHandlingData);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.main.clearAllNotices();
        if (cc.RedT.GAME_IS_SHOWED) {
            this.main.showResult(dataFinish).then(() => {
                onFinishHandlingData();
            });
        } else {
            onFinishHandlingData();
            this.main.updateAfterResult();
        }
    }
}
