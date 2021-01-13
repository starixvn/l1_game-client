import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BetDetailTip extends cc.Component {
    @property(cc.Label)
    bet: cc.Label = null;

    show(value: number) {
        this.bet.string = numberWithCommas(value);
        this.node.active = true;
        this.node.stopAllActions();
        this.node.runAction(cc.fadeIn(0.1));
    }

    hide() {
        this.node.stopAllActions();
        this.node.runAction(
            cc.sequence(
                cc.fadeOut(0.1),
                cc.callFunc(() => (this.node.active = false))
            )
        );
    }
}
