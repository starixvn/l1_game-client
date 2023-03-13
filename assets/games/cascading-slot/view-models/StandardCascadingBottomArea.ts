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
    gameId: number;

    initTotalBet(node: cc.Node) {
        this.miniBetControl = node.getComponent(CascadingTotalBet);
        this.checkExistNodeBet();
    }

    initBetControl(node: cc.Node) {
        this.betControl = node.getComponent(CascadingBetControl);
        this.checkExistNodeBet();
    }

    checkExistNodeBet() {
        if (this.miniBetControl && this.betControl) {
            this.betControl.gameId = this.gameId;
            this.miniBetControl.initData(this.betControl);
            this.betControl.showView(false);
        }
    }
}
