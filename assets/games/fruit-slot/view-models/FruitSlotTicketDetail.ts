import GameTicketDetailBase from "../../_base/view-models/GameTicketDetailBase";
import FruitSlotTicketDetailItem from "./FruitSlotTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotTicketDetail extends GameTicketDetailBase {
    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Sprite)
    symbols: cc.Sprite[] = [];

    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Label)
    total: cc.Label = null;

    roundID: number;
    result: number;

    public showbetLogs() {
        this.node.active = true;
        for (const betLogDetail of this.betLogDetails) {
            const ticketDetailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const ticketDetailItemComponent = ticketDetailItem.getComponent(FruitSlotTicketDetailItem);
            ticketDetailItemComponent.updateContent(betLogDetail, this.settlementResult);
            this.content.addChild(ticketDetailItem);
        }
    }

    setSicboDetailData(round: number, result: any, dicesSpriteFrames: cc.SpriteFrame[]) {
        this.roundLabel.string = round.toString();
        this.total.string = "test test";
    }
}
