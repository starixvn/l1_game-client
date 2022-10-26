import BetItem from "../../_base/view-models/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotBetItem extends BetItem {
    public setOdd(value: string) {
        if (this.odds) {
            this.odds.string = `x${value}`;
        }
    }

    public resetHighlight() {
        this.highlight.active = false;
        if (this.highlightBackground) {
            this.highlightBackground.active = false;
        }
    }
}
