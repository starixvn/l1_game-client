import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGameHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    setData(data: any) {
        this.time.string = getStringDateByTime(data.time);
        this.round.string = data.roundId.toString();
        this.win.string = numberWithCommas(data.betwin, 2);
    }
}
