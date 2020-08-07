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

    public showWinning() {
        this.winning && (this.winning.active = true);
    }

    public hideWinning() {
        this.winning && (this.winning.active = false);
    }
}
