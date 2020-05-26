import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler"
import MiniSedie from "../MiniSedie";

export default class MiniSedieFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: MiniSedie) {
        super(main, 3);
        this.main.animation.on("finished", () => {
            this.main.showResult();
            this.main.timeHandler.resetTime();
        });
    }

    handleFinishData(dataFinish) {
        super.handleFinishData(dataFinish);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.main.roundId = dataFinish.roundId;

        if (cc.RedT.GAME_IS_SHOWED) {
            this.playResultAnimation();
        }
    }

    playResultAnimation() {
        if (cc.RedT.GAME_IS_SHOWED) {
            this.main.animation.play();
        }
    }
}