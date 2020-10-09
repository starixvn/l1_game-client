const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDieHistoryItem extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    phien: cc.Label = null;

    @property(cc.Label)
    option: cc.Label = null;

    @property(cc.Sprite)
    kqSprite: cc.Sprite = null;

    @property(cc.Label)
    kqLabel: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    refund: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    roundId: number = 0;

    public handleRoundIdClick = (roundId: number) => { }

    openBetHistory() {
        this.handleRoundIdClick(this.roundId);
    }
}