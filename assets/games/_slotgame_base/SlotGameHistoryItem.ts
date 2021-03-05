import { getStringDateByTime } from "./../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "./../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameHistoryItem extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundID: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    payLines: cc.Label = null;

    @property(cc.Label)
    totalAmount: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Node)
    jackpotIcon: cc.Node = null;

    data: any = null;

    public showTicketDetail = (data: any) => {};

    openTicketDetail() {
        this.showTicketDetail(this.data);
    }

    setData(betLog, index) {
        let win = betLog.betWin;

        if (betLog.settlementResult.jackpot !== null) {
            win += betLog.settlementResult.jackpot.winningAmount;
            this.jackpotIcon.active = true;
        }

        this.node.active = true;
        this.bg.active = index % 2 > 0;
        this.time.string = getStringDateByTime(betLog.time);
        this.roundID.string = betLog.id;
        this.payLines.string = betLog.paylines.length;
        this.bet.string = numberWithCommas(betLog.bet, 1);
        this.totalAmount.string = betLog.freeSpin ? "0" : numberWithCommas(betLog.totalAmount, 1);
        this.win.string = numberWithCommas(win);
        this.data = betLog;

        const highlightColor = win <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        this.time.node.color = highlightColor;
        this.payLines.node.color = highlightColor;
        this.bet.node.color = highlightColor;
        this.win.node.color = highlightColor;
    }
}
