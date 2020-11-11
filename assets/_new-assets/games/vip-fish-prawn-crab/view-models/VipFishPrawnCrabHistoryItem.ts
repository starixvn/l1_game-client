const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabHistoryItem extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Sprite)
    dices: cc.Sprite[] = [];

    @property(cc.Label)
    gourd: cc.Label = null;

    @property(cc.Label)
    crab: cc.Label = null;

    @property(cc.Label)
    prawn: cc.Label = null;

    @property(cc.Label)
    fish: cc.Label = null;

    @property(cc.Label)
    rooster: cc.Label = null;

    @property(cc.Label)
    stag: cc.Label = null;
    
    @property(cc.Label)
    anyTriple: cc.Label = null;

    @property(cc.Label)
    mountain: cc.Label = null;

    @property(cc.Label)
    ocean: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;
}