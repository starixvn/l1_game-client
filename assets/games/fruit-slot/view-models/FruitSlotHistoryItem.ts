import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { BetLog } from "./FruitSlotHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotHistoryItem extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Sprite)
    symbols: cc.Sprite[] = [];

    @property(cc.Label)
    bigSmallLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    winLabel: cc.Label = null;

    time: string = null;
    round: number = null;
    result: any = {};
    winning: number = null;
    amount: number = null;
    betLogDetails: any = null;
    settlementResult: any = null;

    public showTicketDetail = (round: number, time: string, result: any, betLogDetails: any, settlementResult: any) => {};

    openTicketDetail() {
        this.showTicketDetail(this.round, this.time, this.result, this.betLogDetails, this.settlementResult);
    }

    setData(betLog: BetLog) {
        this.timeLabel.string = getStringDateByTime(betLog.time);
        this.bigSmallLabel.string = betLog.result.number.toString();
        this.roundLabel.string = betLog.phien.toString();
        this.winLabel.string = betLog.betwin.toString();
        // this.amountLabel.string = betLog.amount.toString();
    }
}
