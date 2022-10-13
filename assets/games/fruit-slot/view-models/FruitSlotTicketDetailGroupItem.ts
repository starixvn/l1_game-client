import * as _ from "lodash";

const { ccclass, property } = cc._decorator;
@ccclass
export default class FruitSlotTicketDetailGroupItem extends cc.Component {
    @property(cc.Label)
    spin: cc.Label = null;

    @property({ type: cc.Sprite })
    symbol: cc.Sprite = null;

    height: number = null;

    updateContent(symbol: any, index: number, symbolsSpriteFrames: cc.SpriteFrame[]) {
        // TO DO
        this.spin.string = index === 0 ? "Spin Result" : "Extra Spin";
        this.symbol.spriteFrame = symbolsSpriteFrames.find((sprite) => sprite.name === `item_${symbol}`);
        this.height = this.node.height;
    }
}
