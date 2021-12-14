import { getInternationalFractionalOdds } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HoldemPokerAaOddsTable extends cc.Component {
    @property(cc.Label)
    royalFlush: cc.Label = null;

    @property(cc.Label)
    straightFlush: cc.Label = null;

    @property(cc.Label)
    fourOfAKind: cc.Label = null;

    @property(cc.Label)
    fullHouse: cc.Label = null;

    @property(cc.Label)
    flush: cc.Label = null;

    @property(cc.Label)
    pairOfAcesOrHigher: cc.Label = null;

    start() {}

    set RoyalFlush(value: number) {
        this.royalFlush.string = getInternationalFractionalOdds(value);
    }

    set StraightFlush(value: number) {
        this.straightFlush.string = getInternationalFractionalOdds(value);
    }

    set FourOfAKind(value: number) {
        this.fourOfAKind.string = getInternationalFractionalOdds(value);
    }

    set FullHouse(value: number) {
        this.fullHouse.string = getInternationalFractionalOdds(value);
    }

    set Flush(value: number) {
        this.flush.string = getInternationalFractionalOdds(value);
    }

    set PairOfAcesOrHigher(value: number) {
        this.pairOfAcesOrHigher.string = getInternationalFractionalOdds(value);
    }
}
