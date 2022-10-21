const { ccclass, property } = cc._decorator;

import { BetLog } from "./FruitSlotHistory";
import FruitSlotTicketDetailGroupItem from "./FruitSlotTicketDetailGroupItem";

@ccclass
export default class FruitSlotTicketDetailIGroup extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    betChoiceGroupNode: cc.Node = null;

    @property(cc.Prefab)
    betItemPrefab: cc.Prefab = null;

    onLoad() {
        this.betChoiceGroupNode.children.forEach((child) => child.destroy());
    }

    onDisable() {
        this.betChoiceGroupNode.destroyAllChildren();
    }

    createBetLogItem(betLogs: BetLog, symbolsSpriteFrames: cc.SpriteFrame[]) {
        this.timeLabel.string = betLogs.phien.toString();

        let height = 0;

        betLogs.result.symbols.forEach((symbol, index) => {
            height += this.createTicketDetailItem(
                betLogs.result.isLucky && index === 0 ? "lucky" : symbol,
                index,
                betLogs.result.number,
                symbolsSpriteFrames
            );
        });

        this.node.height = height;
        this.node.parent.parent.height = height + 48;
        // this.node.getChildByName("roundCell").height = height;
    }

    private createTicketDetailItem(symbol: any, index: number, bigSmallValue: number, symbolsSpriteFrames: cc.SpriteFrame[]): number {
        if (!this.betItemPrefab) {
            return 0;
        }
        const betItem = cc.instantiate(this.betItemPrefab);
        const betItemComponent = betItem.getComponent(FruitSlotTicketDetailGroupItem);
        this.betChoiceGroupNode.addChild(betItem);
        betItemComponent.updateContent(symbol, index, bigSmallValue, symbolsSpriteFrames);

        return betItemComponent.height;
    }
}
