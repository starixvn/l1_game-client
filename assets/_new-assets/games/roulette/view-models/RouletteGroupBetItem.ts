import CustomButton from "../../../common/custom-button/CustomButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteGroupBetItem extends CustomButton {
    @property
    betType: string = ""

    @property
    numbers: string = "";

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
        this.callback.highlight = (highlight) => this.groupBetItemCallback.highlight(highlight, this.selectedNumbers);
        this.callback.selected = () => this.groupBetItemCallback.selected(this.betType, this.selectedNumbers);
    }
}
