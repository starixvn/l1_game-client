// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BitcoinMasterUtils from "./BitcoinMasterUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterUpDownResultDetail extends cc.Component {
    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    marginValue: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    upImage: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    downImage: cc.SpriteFrame = null;

    public setData(data: any) {
        this.result.string = `${data.result.close} `;
        const value = parseFloat(BitcoinMasterUtils.getUpDownResult(data.result));
        this.marginValue.string = BitcoinMasterUtils.absResult(value);

        const color = cc.Color.WHITE;
        if (value === 0) {
            this.icon.node.active = false;
            this.result.node.color = color;
        } else {
            const isUpResult = value > 0;
            this.marginValue.node.color = isUpResult ? color.fromHEX("#c4f738") : color.fromHEX("#f3485f");
            this.icon.spriteFrame = isUpResult ? this.upImage : this.downImage;
        }
    }
}
