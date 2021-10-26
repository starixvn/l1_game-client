const { property, ccclass } = cc._decorator;

@ccclass
export default class BitcoinMasterUpDownRoundHistoryTip extends cc.Component {
    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    marginValue: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    upImage: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    downImage: cc.SpriteFrame = null;

    public show(show = true) {
        this.node.active = show;
    }

    public setData(data: any) {
        this.roundId.string = `#${data.roundId}`;
        this.result.string = data.result.close;
        const margin = data.result.close - data.result.open;
        this.marginValue.string = margin.toFixed(2).toString();
        if (margin === 0) {
            this.icon.node.active = false;
        }

        this.icon.spriteFrame = margin > 0 ? this.upImage : this.downImage;
    }
}
