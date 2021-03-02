import BetChips from "./BetChips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipBetChips extends BetChips {
    customizeCredit(): void {
        this.chipValues = [10, 50, 100, 200, 500, 1000, 2000, 3000];
    }

    customizeCash(): void {
        this.chipValues = [10, 20, 50, 100, 200, 500, 1000, 5000, 10000, 20000];
    }
}
