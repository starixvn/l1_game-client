import { i18n } from "../../../ClientModules";

const { ccclass, property } = cc._decorator;
@ccclass
export default class FruitSlotTicketDetailGroupItem extends cc.Component {
    @property(cc.Label)
    spin: cc.Label = null;

    @property({ type: cc.Sprite })
    symbol: cc.Sprite = null;

    @property(cc.Label)
    bigSmallValueLabel: cc.Label = null;

    @property(cc.Node)
    bigSymbol: cc.Node = null;

    @property(cc.Node)
    smallSymbol: cc.Node = null;

    height: number = null;

    updateContent(symbol: any, index: number, bigSmallValue: number, symbolsSpriteFrames: cc.SpriteFrame[]) {
        this.symbol.spriteFrame = symbolsSpriteFrames.find((sprite) => sprite.name === `item_${symbol}`);

        this.height = this.node.height;
        if (index === 0) {
            this.spin.string = i18n.t("fruitSlot.spinResult");
            this.bigSmallValueLabel.string = bigSmallValue.toString();
            const isBigSymbol = bigSmallValue > 7;
            this.bigSymbol.active = isBigSymbol;
            this.smallSymbol.active = !isBigSymbol;
            this.node.getChildByName("topBorder").active = false;
        } else {
            this.node.getChildByName("bigSmall").active = false;
            this.spin.string = i18n.t("fruitSlot.extraSpin");
        }
    }
}
