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
            this.playResultAnimation();
        }
    }

    playResultAnimation() {
        var resultNumbers = this.main.currentDataLogs[0].result;
        this.main.resultAnimating = true;
        this.main.resultFrame.active = true;
        this.main.totalResult.string = "0";
        this.main.kenoNumbers.forEach(keno => keno.show(false));
        var i = 0;
        var sequence = cc.sequence(
            cc.callFunc(() => {
                this.main.kenoNumbers[i].setNumber(resultNumbers[i]);
                this.main.totalResult.string = this.main.getTempTotal(resultNumbers, i).toString();
                i++;
            }),
            cc.delayTime(0.1)
        );

        this.main.resultNumberNode.runAction(cc.sequence(
            cc.repeat(sequence, 20),
            cc.callFunc(() => this.main.resultAnimating = false)));
    }
}
