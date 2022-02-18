import NewCard from "../../../../common/new-card/view-models/NewCard";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends NewCard {
    @property(cc.Node)
    highlight: cc.Node = null;
}
