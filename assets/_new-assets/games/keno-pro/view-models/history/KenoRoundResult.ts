import KenoNumber from "../KenoNumber";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoRoundResult extends cc.Component {

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Node)
    settleResult: cc.Node = null;

    @property(cc.Node)
    resultNumbers: cc.Node = null;

    public result: number[] = [];
    public kenoNumbers: KenoNumber[] = [];
    public settlementResult: any;
    public resultLabels: cc.Label[] = [];
    private readonly choiceMapper = {
        big: "Tài",
        small: "Xỉu",
        odd: "Lẻ",
        even: "Chẵn",
        gold: "Kim",
        wood: "Mộc",
        water: "Thủy",
        fire: "Hỏa",
        earth: "Thổ",
    };

    onLoad() {
        this.kenoNumbers = this.resultNumbers.children.map(child => child.getComponent(KenoNumber));
        this.kenoNumbers.forEach(keno => keno.show(false));
        this.resultLabels = this.settleResult.children.map(child => child.getComponent(cc.Label));

        for (let i = 0; i < this.result.length; i++) {
            this.kenoNumbers[i].setNumber(this.result[i], false);
            this.kenoNumbers[i].show(true);
        }

        let index = 0;
        Object.keys(this.settlementResult).forEach(key => {
            if (this.settlementResult[key]) {
                this.resultLabels[index].string = this.choiceMapper[key];
                index++;
            }
        });
    }
}
