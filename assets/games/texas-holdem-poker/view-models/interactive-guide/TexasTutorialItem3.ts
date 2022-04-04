import GameUtils from "../../../../common/GameUtils";
import TutorialItem from "../../../../common/tutorial/TutorialItem";
import TexasTurorialMain from "./TexasTutorialMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasTutorialItem3 extends TutorialItem {
    swapButton: cc.Node = null;
    holdButton: cc.Node = null;

    show() {
        super.show();

        const parent = this.node.parent.parent;
        const tutorialMain = parent.getComponent(TexasTurorialMain);

        this.swapButton = tutorialMain.swapButton;
        this.holdButton = tutorialMain.holdButton;

        GameUtils.moveToOtherNode(this.swapButton, this.node);
        GameUtils.moveToOtherNode(this.holdButton, this.node);
    }
}
