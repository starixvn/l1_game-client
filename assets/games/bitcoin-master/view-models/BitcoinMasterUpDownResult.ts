import { color } from "../../../../creator";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterUpDownResult extends cc.Component {
    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    upIcon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    downIcon: cc.SpriteFrame = null;

    setData(data: any) {
        const marginValue = data.close - data.open;
        this.result.string = marginValue.toFixed(2).toString();
        this.result.node.color = marginValue ? cc.Color.GREEN : cc.Color.RED;
        this.icon.spriteFrame = marginValue ? this.upIcon : this.downIcon;
    }
}
