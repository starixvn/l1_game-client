import FruitSlotSpinItem from "../../fruit-slot/view-models/FruitSlotSpinItem";
import FootballSlotSymbolSpineAnimation from "./FootballSlotSymbolSpineAnimation";

const { ccclass } = cc._decorator;

@ccclass
export default class FootballSlotSpinItem extends FruitSlotSpinItem {
    public playSpineSymbolAnimation() {
        if (this.symbolSpineAnim) {
            this.symbolSpineAnim.getComponent(FootballSlotSymbolSpineAnimation).playAnimSymbol(true);
            this.symbolSpineAnim.getComponent(FootballSlotSymbolSpineAnimation).highlightSymbol(true);
        }
    }

    public resetHighlight() {
        this.highlight && (this.highlight.opacity = 0);
        this.symbolSpineAnim.getComponent(FootballSlotSymbolSpineAnimation).playAnimSymbol(false);
        this.symbolSpineAnim.getComponent(FootballSlotSymbolSpineAnimation).highlightSymbol(false);
    }
}
