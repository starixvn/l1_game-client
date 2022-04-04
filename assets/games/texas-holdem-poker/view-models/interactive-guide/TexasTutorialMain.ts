import NewCard from "../../../../common/new-card/view-models/NewCard";
import TutorialMain from "../../../../common/tutorial/TutorialMain";

const { ccclass, property } = cc._decorator;

const TimeConfig = [15, 5, 5, 5];

@ccclass
export default class TexasTurorialMain extends TutorialMain {
    @property({ type: NewCard })
    dealerCards: NewCard[] = [];

    @property({ type: NewCard })
    playerCards: NewCard[] = [];

    @property(cc.Node)
    swapButton: cc.Node = null;

    @property(cc.Node)
    holdButton: cc.Node = null;

    @property(cc.Node)
    callButton: cc.Node = null;

    @property(cc.Node)
    cancelButton: cc.Node = null;
}
