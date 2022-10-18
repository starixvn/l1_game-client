import * as _ from "lodash";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;
@ccclass
export default class FruitSlotTicketDetailGroupItem extends cc.Component {
    @property(cc.Label)
    spin: cc.Label = null;

    @property({ type: cc.Sprite })
    symbol: cc.Sprite = null;

    @property(cc.Label)
    bigSmallValueLabel: cc.Label = null;

    @property({ type: cc.Sprite })
    bigSmallResultSymbol: cc.Sprite = null;

    height: number = null;

    updateContent(symbol: any, index: number, bigSmallValue: number, symbolsSpriteFrames: cc.SpriteFrame[]) {
        // TO DO
        // this.spin.string = index === 0 ? "Spin Result" : "Extra Spin";
        this.symbol.spriteFrame = symbolsSpriteFrames.find((sprite) => sprite.name === `item_${symbol}`);

        this.height = this.node.height;
        if (index === 0) {
            this.spin.string = "Spin Result";
            this.bigSmallValueLabel.string = bigSmallValue.toString();
            const matched = (sprite: cc.SpriteFrame, symbol: string) => sprite.name === symbol;
            this.bigSmallResultSymbol.spriteFrame = symbolsSpriteFrames.find((sprite) =>
                matched(sprite, `item_${bigSmallValue > 7 ? "big" : "small"}`)
            );
            this.node.getChildByName("topBorder").active = false;
        } else {
            this.node.getChildByName("bigSmall").active = false;
            this.spin.string = "Extra Spin";
        }
    }
}
