
const { ccclass, property } = cc._decorator;
import * as helper from "../../../common/helpers/Helper"

@ccclass
export default class BetDetailTip extends cc.Component {

    @property(cc.Label)
    bet: cc.Label = null;

    show(value: number) {
        this.bet.string = helper.numberWithCommas(value);
        this.node.active = true;
        this.node.stopAllActions();
        this.node.runAction(cc.fadeIn(0.1));
    }

    hide() {
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.fadeOut(0.1),
            cc.callFunc(() => this.node.active = false)
        ));
    }
}
