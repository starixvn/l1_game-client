import KenoNumber from "../KenoNumber";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoRoundResult extends cc.Component {

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Node)
    resultNumbers: cc.Node = null;

    public result: number[] = [];
    public kenoNumbers: KenoNumber[] = [];

    onLoad() {
        this.kenoNumbers = this.resultNumbers.children.map(child => child.getComponent(KenoNumber));
        this.kenoNumbers.forEach(keno => keno.show(false));

        for (let i = 0; i < this.result.length; i++) {
            this.kenoNumbers[i].setNumber(this.result[i]);
            this.kenoNumbers[i].show(true);
        }
    }
}
