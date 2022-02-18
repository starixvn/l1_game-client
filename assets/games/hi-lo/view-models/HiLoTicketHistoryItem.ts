import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { BetLog } from "./HiLoBetData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    renderTicketItem(item: BetLog) {
        this.time.string = getStringDateByTime(item.time);
        this.roundId.string = item.id.toString();
        this.stake.string = numberWithCommas(item.amount, 2);
        this.win.string = numberWithCommas(item.betwin, 2);
        if (item.betwin > item.amount) {
            this.stake.node.color = cc.Color.YELLOW;
        }
    }

    openTicketDetail() {}
}
