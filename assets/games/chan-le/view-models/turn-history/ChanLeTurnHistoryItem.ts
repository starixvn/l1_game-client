const { ccclass, property } = cc._decorator;

@ccclass
export default class ChanLeTurnHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    refund: cc.Label = null;

    @property(cc.Node)
    highlight: cc.Node = null;

    setHighlightText(highlight) {
        const color = highlight ? cc.Color.YELLOW : cc.Color.WHITE;
        this.time.node.color = color;
        this.userName.node.color = color;
        this.bet.node.color = color;
        this.refund.node.color = color;
    }
}
