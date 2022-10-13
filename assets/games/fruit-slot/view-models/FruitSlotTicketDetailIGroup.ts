const { ccclass, property } = cc._decorator;

import * as _ from "lodash";
import { getStringHourByTime } from "../../../common/helpers/DateTimeHelper";
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
            height += this.createTicketDetailItem(betLogs.result.isLucky && index === 0 ? "lucky" : symbol, index, symbolsSpriteFrames);
        });

        this.node.height = height;
    }

    private createTicketDetailItem(symbol: any, index, symbolsSpriteFrames: cc.SpriteFrame[]): number {
        if (!this.betItemPrefab) {
            return 0;
        }
        const betItem = cc.instantiate(this.betItemPrefab);
        const betItemComponent = betItem.getComponent(FruitSlotTicketDetailGroupItem);
        this.betChoiceGroupNode.addChild(betItem);
        betItemComponent.updateContent(symbol, index, symbolsSpriteFrames);
        return betItemComponent.height;
    }
}
