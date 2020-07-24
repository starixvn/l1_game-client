import CustomButton from "../../../common/custom-button/CustomButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteNumber extends cc.Component {
    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    winning: cc.Node = null;

    public callback = {
        highlight: (highlight: boolean, number: number) => { },
        selected: (number: number) => { }
    }

    public initCustomButton() {
        const customButton = this.highlight.addComponent(CustomButton);
        customButton.callback.highlight = (highlight) => this.callback.highlight(highlight, +this.node.name);
        customButton.callback.selected = () => this.callback.selected(+this.node.name);
    }

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
        this.highlight.runAction(cc.fadeOut(0.1));
        // this.winning && (this.winning.active = true);
    }
}
