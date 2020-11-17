import BetItem from "../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSicBoBetItem extends BetItem {

    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        this.highlight.active = highlight && isAnimated;
        this.highlightBackground && (this.highlightBackground.active = highlight && isAnimated);

        this.highlightBorder && (this.highlightBorder.active = highlight && !isAnimated);
        this.normalBorder && (this.normalBorder.active = !highlight);
    }
}