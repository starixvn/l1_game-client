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

    @property
    textHighlightColor: cc.Color = cc.Color.WHITE.fromHEX("#fffc00");

    @property
    textNormalColor: cc.Color = cc.Color.WHITE;

    @property
    enableHighlightBg = false;

    bgHighlightColor: cc.Color = cc.Color.WHITE;

    data: any = null;

    setData(betLog, index) {
        // handle
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

        const highlight = win > 0;
        const highlightColor = highlight ? this.textHighlightColor : this.textNormalColor;
        this.time.node.color = highlightColor;
        this.betLevel.node.color = highlightColor;
        this.coinValue.node.color = highlightColor;

        if (this.enableHighlightBg && highlight) {
            this.bg.active = true;
            this.bg.color = this.bgHighlightColor;
        }
    }

    public showTicketDetail = (data: any) => {
        // handle
    };

    openTicketDetail() {
        this.showTicketDetail(this.data);
    }
}
