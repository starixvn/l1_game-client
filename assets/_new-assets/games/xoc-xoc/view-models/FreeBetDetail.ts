const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeBetDetail extends cc.Component {
    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.SpriteFrame)
    resultSprite: cc.SpriteFrame = null;

    @property(cc.Label)
    resultNumber: cc.Label = null;

    private win: number;

    init(roundId, resultNumber, win) {
        this.win = win;
        this.roundId.string = roundId;
        this.resultNumber.string = resultNumber;
    }
}