import NewCard from "../../../../common/new-card/view-models/NewCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardChain extends NewCard {
    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    infoTag: cc.Node = null;

    @property(cc.Label)
    cardOrder: cc.Label = null;

    setHighlight() {
        this.highlight.active = true;
    }

    setNumberTag(data: string) {
        this.cardOrder.string = data;
    }

    getNumberTag() {
        return this.cardOrder.string;
    }

    resetHighlight() {
        this.highlight.active = false;
    }
}
