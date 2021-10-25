const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterResult extends cc.Component {
    @property(cc.Label)
    upDownResultLabel: cc.Label = null;

    @property(cc.Sprite)
    upDownIcon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    upImage: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    downImage: cc.SpriteFrame = null;

    @property(cc.Label)
    evenOddResultLabel: cc.Label = null;

    @property(cc.Label)
    closeBitcoinLabel: cc.Label = null;

    showResult(show = true) {
        this.closeBitcoinLabel.node.active = show;
        this.upDownResultLabel.node.active = show;
        this.upDownIcon.node.active = show;
        this.evenOddResultLabel.node.active = show;
    }

    setData(data: any) {
        this.closeBitcoinLabel.string = data.close;

        const color = cc.Color.BLACK;
        const marginValue = data.close - data.open;
        if (marginValue === 0) {
            this.upDownResultLabel.string = "00.00";
            this.upDownResultLabel.node.color = color;
            this.upDownIcon.node.active = false;
        } else {
            this.upDownResultLabel.string = marginValue.toFixed(2).toString();
            this.upDownResultLabel.node.color = marginValue ? color.fromHEX("#c4f738") : color.fromHEX("#d0230b");
            this.upDownIcon.node.active = true;
            this.upDownIcon.spriteFrame = marginValue ? this.upImage : this.downImage;
        }

        const evenOddValue = data.close.toString().substr(-4, 1);
        this.evenOddResultLabel.string = evenOddValue;
        this.evenOddResultLabel.node.color = evenOddValue % 2 ? color.fromHEX("#d0230b") : color.fromHEX("#bac5ca");
    }
}
