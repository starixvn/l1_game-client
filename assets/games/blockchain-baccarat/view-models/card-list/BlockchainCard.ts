import NewCard from "../../../../common/new-card/view-models/NewCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainCard extends NewCard {
    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    shadow: cc.Node = null;

    @property(cc.Label)
    indexNumber: cc.Label = null;

    setHighlight() {
        this.highlight.active = true;
    }

    resetHighlight() {
        this.highlight.active = false;
    }
}
