const { ccclass, property } = cc._decorator;

@ccclass
export default class BauCuaHistoryItems extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property({ type: cc.Sprite })
    dices: cc.Sprite[] = [];

    @property({ type: cc.Node })
    betList: cc.Node[] = [];

    @property(cc.Label)
    win: cc.Label = null;
}
