import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Keno from "../Keno";
import * as _ from "lodash";

export default class KenoFinishHandler extends GameBaseFinishHandler {

    constructor(protected readonly main: Keno) {
        super(main, 2);
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
        var shuffle = [];
        for (var i = 0; i < 20; i++) {
            shuffle.push(i);
        }
        shuffle = _.shuffle(shuffle);

        var i = 0;
        var sequence = cc.sequence(
            cc.callFunc(() => {
                var index = shuffle[i];
                this.main.kenoNumbers[index].setNumber(resultNumbers[index]);
                var total = 0;
                for (var j = 0; j <= i; j++) {
                    total += resultNumbers[shuffle[j]];
                }
                this.main.totalResult.string = total.toString();
                i++;
            }),
            cc.delayTime(this.playResultAnimationTime / 20)
        );

        this.main.resultNumberNode.runAction(cc.sequence(
            cc.repeat(sequence, 20),
            cc.callFunc(() => this.main.resultAnimating = false)));
    }
}
