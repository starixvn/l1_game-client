import BetItem from "../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedieBetItem extends BetItem {
    public resetHighlight() {
        this.highlight.active = false;
        if (this.highlightBackground) {
            this.highlightBackground.active = false;
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
            this.normalBorder.active = !highlight;
        }
    }
}
