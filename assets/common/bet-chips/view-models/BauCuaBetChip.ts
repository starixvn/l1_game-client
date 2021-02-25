import BetChips from "./BetChips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BauCuaBetChips extends BetChips {
    customizeCash(): void {
        this.chipValues = [10, 20, 50, 100, 200, 500, 1000, 5000, 10000];
    }
}
