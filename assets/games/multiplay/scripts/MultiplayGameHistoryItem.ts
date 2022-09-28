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
    gameName: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Node)
    bgRow: cc.Node = null;

    setData(data: any, index: number) {
        this.time.string = getStringDateByTime(data.time);
        this.gameName && (this.gameName.string = data.gameName);
        this.round.string = data.roundId.toString();
        this.win.string = numberWithCommas(data.betwin, 2);
        this.bgRow.active = index % 2 === 1;
    }
}
