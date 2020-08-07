import CustomButton from "../../../common/custom-button/CustomButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteGroupBetItem extends CustomButton {
    @property
    betType: string = ""

    @property
    numbers: string = "";

    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    winning: cc.Node = null;

    private selectedNumbers: number[] = [];

    public groupBetItemCallback = {
        highlight: (highlight: boolean, numbers: number[]) => { },
        selected: (betType: string, numbers: number[]) => { }
    }

    getNumbers(): number[] {
        return this.selectedNumbers;
    }

    onLoad() {
        super.onLoad();

        this.selectedNumbers = this.numbers.split(',').map(i => +i);
        this.callback.highlight = (highlight) => {
            this.groupBetItemCallback.highlight(highlight, this.selectedNumbers);
            highlight ? this.showHighlight() : this.clearHighlight();
        };
        this.callback.selected = () => this.groupBetItemCallback.selected(this.betType, this.selectedNumbers);

        this.clearHighlight();
        this.hideWinning();
    }

    public clearHighlight() {
        this.highlight && this.highlight.runAction(cc.fadeOut(0.1));
    }

    public showHighlight() {
        this.highlight && this.highlight.runAction(cc.fadeIn(0.11));
    }

    public showWinning() {
        this.winning && (this.winning.active = true);
    }

    public hideWinning() {
        this.winning && (this.winning.active = false);
    }
}
