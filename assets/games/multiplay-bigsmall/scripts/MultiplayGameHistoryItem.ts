import { getStringHourByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGameHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    betChoice: cc.Label = null;

    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    setData(data: any) {
        this.time.string = getStringHourByTime(data.time);
        this.round.string = data.roundId;
        this.win.string = numberWithCommas(data.betwin, 2);
        this.stake.string = data.totalAmount;
    }
}
