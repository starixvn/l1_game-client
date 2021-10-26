import AudioManager from "../../../common/audio/AudioManager";
import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Label)
    return: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    bottomLine: cc.Node = null;

    public showTicketDetail = (data: any) => {};
    protected data: any;

    openTicketDetail() {
        AudioManager.getInstance().playClick();
        this.showTicketDetail(this.data);
    }

    setData(data: any, index: number) {
        this.data = data;

        this.background.active = index % 2 !== 0;
        this.time.string = getStringDateByTime(data.time);
        this.roundId.string = data.phien.toString();
        this.win.string = numberWithCommas(data.betwin);
        this.totalBet.string = numberWithCommas(data.totalAmount);
    }
}
