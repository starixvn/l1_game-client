import CascadingBetControl from "./CascadingBetControl";
import CascadingTotalBet from "./CascadingTotalBet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingBottomArea extends cc.Component {
    @property(cc.Toggle)
    autoSpinToggle: cc.Toggle = null;

    @property(cc.Toggle)
    turboToggle: cc.Toggle = null;

    @property(cc.Label)
    totalWinLabel: cc.Label = null;

    miniBetControl: CascadingTotalBet;
    betControl: CascadingBetControl;

    initTotalBet(node: cc.Node) {
        this.miniBetControl = node.getComponent(CascadingTotalBet);
    }

    initBetControl(node: cc.Node) {
        this.betControl = node.getComponent(CascadingBetControl);
    }
}
