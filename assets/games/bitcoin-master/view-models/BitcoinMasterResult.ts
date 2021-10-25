const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterResult extends cc.Component {
    @property(cc.Label)
    upDownResultLabel: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    upIcon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    downIcon: cc.SpriteFrame = null;

    @property(cc.Label)
    evenOddResultLabel: cc.Label = null;

    setData(data: any) {
        const marginValue = data.close - data.open;
        this.upDownResultLabel.string = marginValue.toFixed(2).toString();
        const color = cc.Color.WHITE;
        this.upDownResultLabel.node.color = marginValue ? color.fromHEX("#c4f738") : color.fromHEX("#d0230b");
        this.icon.spriteFrame = marginValue ? this.upIcon : this.downIcon;

        this.evenOddResultLabel.string = data.close.toString().substr(-4, 1);
    }
}
