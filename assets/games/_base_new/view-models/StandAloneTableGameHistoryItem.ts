import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandAloneTableGameHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Node)
    bg: cc.Node = null;

    data: any = null;

    setData(data: any, index: number) {
        const { time, roundId, stake, result, betwin, settlementResult } = data;
        this.time.string = getStringDateByTime(time);
        this.roundId.string = roundId;
        this.stake.string = numberWithCommas(this.handleStake(settlementResult, data));
        this.win.string = betwin;
        this.handleResult(result);
        this.handleStake(settlementResult, data);
        this.data = data;
        this.bg.active = index % 2 > 0;
    }

    handleStake(settlementResult: any, data: any) {
        let stake = 0;
        Object.keys(settlementResult).forEach((choice) => {
            stake += data[choice];
        });
        return stake;
    }

    handleResult(result: any) {}

    public showTicketDetail = (data: any) => {};

    openTicketDetail() {
        this.showTicketDetail(this.data);
    }
}
