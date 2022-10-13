import GameTicketDetailBase from "../../_base/view-models/GameTicketDetailBase";
import FruitSlotTicketDetailGroupItem from "./FruitSlotTicketDetailGroupItem";
import FruitSlotTicketDetailIGroup from "./FruitSlotTicketDetailIGroup";
import FruitSlotTicketDetailItem from "./FruitSlotTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotTicketDetail extends GameTicketDetailBase {
    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    fruitSlotTicketDetailGroup: cc.Prefab = null;

    @property(cc.Node)
    groupContent: cc.Node = null;

    @property(cc.Label)
    total: cc.Label = null;

    roundID: number;
    result: number;

    public showbetLogs(symbolSprites: cc.SpriteFrame[], odds, betLogs) {
        this.node.active = true;

        const fruitSlotTicketDetailGroup = cc.instantiate(this.fruitSlotTicketDetailGroup);
        const fruitSlotTicketDetailGroupmComponent = fruitSlotTicketDetailGroup.getComponent(FruitSlotTicketDetailIGroup);
        this.groupContent.addChild(fruitSlotTicketDetailGroup);
        fruitSlotTicketDetailGroupmComponent.createBetLogItem(betLogs, symbolSprites);

        for (const betLogDetail of this.betLogDetails) {
            const ticketDetailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const ticketDetailItemComponent = ticketDetailItem.getComponent(FruitSlotTicketDetailItem);
            this.content.addChild(ticketDetailItem);
            ticketDetailItemComponent.updateContent(betLogDetail, odds, this.settlementResult, symbolSprites);
        }
    }

    setFruitSlotDetailData(round: number, result: any, symbolSpriteFrames: cc.SpriteFrame[]) {
        this.roundLabel.string = round.toString();

        this.total.string = "10000";
    }
}
