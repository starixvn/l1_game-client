import ExpandableMenu from "../../../common/expandable-menu/view-models/ExpandableMenu";
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

    @property(cc.Node)
    totalWinNode: cc.Node = null;

    miniBetControl: CascadingTotalBet;

    initTotalBet(node: cc.Node) {
        this.miniBetControl = node.getComponent(CascadingTotalBet);
    }

    onClickListener = {
        onAutoSpinChanged: () => {},
        onTurboModeChanged: (toggle) => {}
    };

    onAutoSpinChanged() {
        this.onClickListener.onAutoSpinChanged();
    }

    onTurboModeChanged(toggle: cc.Toggle) {
        this.onClickListener.onTurboModeChanged(toggle);
    }
}
