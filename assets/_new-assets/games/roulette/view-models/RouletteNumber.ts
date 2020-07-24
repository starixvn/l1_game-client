
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
        this.highlight && (this.highlight.active = false);
        this.winning && (this.winning.active = false);
    }

    public showHighlight() {
        this.highlight && (this.highlight.active = true);
        this.winning && (this.winning.active = false);
    }

    public showWinning() {
        this.highlight && (this.highlight.active = false);
        this.winning && (this.winning.active = true);
    }
}
