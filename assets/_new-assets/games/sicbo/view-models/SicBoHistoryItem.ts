const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoHistoryItem extends cc.Component {

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Sprite)
    dices: cc.Sprite[] = [];

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    winLabel: cc.Label = null;

    time: string = null;
    round: number = null;
    result: object = {};
    winning: number = null;
    amount: number = null;
    betLogDetails: any = null;
    settlementResult: any = null;

    public showTicketDetail = (round: number, time: string, result: any, betLogDetails: any, settlementResult: any) => { }

    openTicketDetail() {
        this.showTicketDetail(this.round, this.time, this.result, this.betLogDetails, this.settlementResult);
    }
}
