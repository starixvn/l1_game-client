import * as helper from "../../../../common/helpers/Helper";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniKenoWinning extends cc.Component {
    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.Label)
    winAmount: cc.Label = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    public isShowing = false;

    init(gameName, roundId, winAmount) {
        this.gameName.string = `${gameName} (#${roundId})`;
        this.winAmount.string = `+${helper.numberWithCommas(winAmount)}`;
    }

    onLoad() {
        this.animation.on(
            "finished",
            () => {
                this.isShowing = false;
            },
            this
        );
    }

    show() {
        this.isShowing = true;
        this.animation.play();
    }
}
