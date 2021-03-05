const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    phien: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    refund: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    roundId = 0;

    public handleRoundIdClick = (roundId: number) => {};

    openBetHistory() {
        this.handleRoundIdClick(this.roundId);
    }
}
