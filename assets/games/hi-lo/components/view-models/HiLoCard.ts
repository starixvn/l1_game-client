import NewCard from "../../../../common/new-card/view-models/NewCard";
const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoCard extends NewCard {
    @property(cc.Node)
    highlight: cc.Node = null;
}
