import { getStringDateByTime } from "./../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "./../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotHistoryItem extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundID: cc.Label = null;

    @property(cc.Label)
    betLevel: cc.Label = null;

    @property(cc.Label)
    coinValue: cc.Label = null;

    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Label)
    totalWin: cc.Label = null;

    // @property
    // textHighlightColor: cc.Color = cc.Color.WHITE.fromHEX("#fffc00");

    data: any = null;

    setData(betLog, index) {
        this.data = betLog;
        const win = betLog.totalTumbleWin;
        this.node.active = true;
        this.bg.active = index % 2 > 0;
        this.time.string = getStringDateByTime(betLog.time);
        this.roundID.string = betLog.id;
        this.betLevel.string = betLog.betLevel;
        this.coinValue.string = betLog.coinValue;
        this.totalBet.string = betLog.totalAmount;
        this.totalWin.string = numberWithCommas(win, 2);
        // if (win > 0) {
        //     this.betLevel.node.color = this.textHighlightColor;
        //     this.coinValue.node.color = this.textHighlightColor;
        // }
    }

    public showTicketDetail = (data: any) => {};

    openTicketDetail() {
        this.showTicketDetail(this.data);
    }
}
