import BetItem from "../../_base/view-models/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotBetItem extends BetItem {
    @property(cc.String)
    betChoice = "";

    public resetHighlight() {
        this.highlight.active = false;
        if (this.highlightBackground) {
            this.highlightBackground.active = false;
        }
    }

    public setOdd(value: string) {
        if (this.odds) {
            this.odds.string = `x${value}`;
        }
    }

    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        this.highlight.active = highlight && isAnimated;
        if (this.highlightBackground) {
            this.highlightBackground.active = highlight && isAnimated;
        }
        if (this.highlightBorder) {
            this.highlightBorder.active = highlight && !isAnimated;
        }
        if (this.normalBorder) {
            this.normalBorder.active = true;
        }
    }
}
