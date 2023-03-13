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

    initTotalBet(node: cc.Node) {
        const totalBet = node.getComponent(CascadingTotalBet);
    }
}
