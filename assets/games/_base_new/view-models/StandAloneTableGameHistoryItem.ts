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
        const { time, roundId, stake, result, betwin } = data;
        this.time.string = time;
        this.roundId.string = roundId;
        this.stake.string = stake;
        this.win.string = betwin;
        this.handleResult(result);
    }

    handleResult(result: any) {}

    public showTicketDetail = (data: any) => {};

    openTicketDetail() {
        this.showTicketDetail(this.data);
    }
}
