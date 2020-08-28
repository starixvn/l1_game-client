const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeBetDetail extends cc.Component {
    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Sprite)
    resultSprite: cc.Sprite = null;

    @property(cc.Label)
    resultNumber: cc.Label = null;

    @property(cc.SpriteFrame)
    iconRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    iconWhite: cc.SpriteFrame = null;

    private win: number;

    init(roundId, resultNumber, win) {
        this.win = win;
        this.roundId.string = roundId;
        this.resultNumber.string = resultNumber;

        if (resultNumber % 2) {
            this.resultSprite.spriteFrame = this.iconRed;
            this.resultNumber.node.color = cc.Color.WHITE;
        } else {
            this.resultSprite.spriteFrame = this.iconWhite;
            this.resultNumber.node.color = cc.Color.BLACK;
        }
    }
}