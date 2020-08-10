import CustomButton from "../../../common/custom-button/CustomButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteNumber extends cc.Component {
    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    winning: cc.Node = null;

    onLoad() {
        this.clearHighlight();
        this.hideWinning();
    }

    public clearHighlight() {
        this.highlight.runAction(cc.fadeOut(0.1));
    }

    public showHighlight() {
        this.highlight.runAction(cc.fadeIn(0.11));
    }

    public showWinning(animated: boolean) {
        this.winning && (this.winning.active = true);

        if (animated) {
            const sequence = cc.sequence(
                cc.fadeOut(.2),
                cc.fadeIn(.2),
            );
            this.winning.runAction(cc.repeat(sequence, 5));
        }
    }

    public hideWinning() {
        this.winning && (this.winning.active = false);
    }
}
