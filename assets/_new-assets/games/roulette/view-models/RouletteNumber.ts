import CustomButton from "../../../common/custom-button/CustomButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteNumber extends cc.Component {
    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    winning: cc.Node = null;

    onLoad() {
        this.clear();
    }

    public clear() {
        this.highlight.runAction(cc.fadeOut(0.1));
        // this.winning && (this.winning.active = false);
    }

    public showHighlight() {
        this.highlight.runAction(cc.fadeIn(0.11));
        // this.winning && (this.winning.active = false);
    }

    public showWinning() {
        // this.highlight.runAction(cc.fadeOut(0.1));
        // this.winning && (this.winning.active = true);

        this.highlight.runAction(cc.fadeIn(0.11));
    }
}
