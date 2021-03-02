import SedieHistoryItemBase from '../../_base/view-models/SedieHistoryItemBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDieHistoryItem extends SedieHistoryItemBase {
    @property(cc.Label)
    option: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    refund: cc.Label = null;

    roundId = 0;

    public handleRoundIdClick = (roundId: number) => {};

    openBetHistory() {
        this.handleRoundIdClick(this.roundId);
    }
}
