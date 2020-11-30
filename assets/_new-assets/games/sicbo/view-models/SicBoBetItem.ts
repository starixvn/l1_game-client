import BetItem from "../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoBetItem extends BetItem {
    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        super.setHighlightItems(highlight, isAnimated);
        this.highlightBorder && (this.highlightBorder.active = highlight && !isAnimated);
    }
}