const { ccclass, property } = cc._decorator;

@ccclass
export default class BlackJackHistoryItem extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    handId: cc.Label = null;

    @property(cc.Node)
    split: cc.Node = null;

    @property(cc.Node)
    dealerCards: cc.Node = null;

    @property(cc.Label)
    dealerResult: cc.Label = null;

    @property(cc.Node)
    playerCards: cc.Node = null;

    @property(cc.Label)
    playerResult: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;
}
