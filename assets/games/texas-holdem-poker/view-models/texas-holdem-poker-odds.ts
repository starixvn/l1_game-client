import { getInternationalFractionalOdds } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasHoldemPokerOdds extends cc.Component {
    @property(cc.Label)
    oddName: cc.Label = null;

    @property(cc.Label)
    oddValue: cc.Label = null;

    @property(String)
    key: string = "";

    set OddValue(value: number) {
        try {
            this.oddValue.string = getInternationalFractionalOdds(value);
        } catch (error) {
            console.log("oddName, oddValue, key", this.oddName, this.oddValue, this.key);
        }
    }
}
