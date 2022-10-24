import GameTicketDetailBase from "../../../_base/view-models/GameTicketDetailBase";
import FruitSlotTicketDetailIGroup from "./FruitSlotTicketDetailIGroup";
import FruitSlotTicketDetailItem from "./FruitSlotTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotTicketDetail extends GameTicketDetailBase {
    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    fruitSlotTicketDetailGroup: cc.Prefab = null;

    @property(cc.Node)
    groupContent: cc.Node = null;

    public showbetLogs(symbolSprites: cc.SpriteFrame[], odds, betLogs) {
        this.node.active = true;

        const fruitSlotTicketDetailGroup = cc.instantiate(this.fruitSlotTicketDetailGroup);
        const fruitSlotTicketDetailGroupmComponent = fruitSlotTicketDetailGroup.getComponent(FruitSlotTicketDetailIGroup);
        this.groupContent.addChild(fruitSlotTicketDetailGroup);
        fruitSlotTicketDetailGroupmComponent.createBetLogItem(betLogs, symbolSprites);

        this.betLogDetails.forEach((betLogDetail, index) => this.builTicketDetailRow(betLogDetail, index, symbolSprites, odds));
    }

    private builTicketDetailRow(betLogDetail, index, symbolSprites, odds) {
        const ticketDetailItem = cc.instantiate(this.ticketDetailItemPrefab);
        const ticketDetailItemComponent = ticketDetailItem.getComponent(FruitSlotTicketDetailItem);
        if (index === 0) {
            ticketDetailItemComponent.node.getChildByName("topBorder").active = false;
        }
        this.content.addChild(ticketDetailItem);
        ticketDetailItemComponent.updateContent(betLogDetail, odds, this.settlementResult, symbolSprites, index);
    }
}
