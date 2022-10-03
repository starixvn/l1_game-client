const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotSpinItem extends cc.Component {
    @property(cc.Node)
    highlight: cc.Node = null;

    public setHighlightItems(highlight: boolean, isRepeatAnim: boolean, isAnimated = true) {
        this.highlight.opacity = highlight && isAnimated ? 255 : 0;
        if (highlight && isAnimated) {
            const isRepeat = isRepeatAnim ? 10 : 1;
            cc.tween(this.highlight)
                .repeat(
                    isRepeat,
                    cc.tween().to(0.05, { opacity: 255 }, { easing: "cubicIn" }).delay(0.2).to(0.05, { opacity: 0 }, { easing: "cubicOut" })
                )
                .start();
        }
    }
}
