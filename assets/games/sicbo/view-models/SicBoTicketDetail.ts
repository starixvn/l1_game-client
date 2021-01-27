import GameTicketDetailBase from "../../_base/GameTicketDetailBase";
import SicBoTicketDetailItem from "./SicBoTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoTicketDetail extends GameTicketDetailBase {
    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Sprite)
    dices: cc.Sprite[] = [];

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
            const ticketDetailItemComponent = ticketDetailItem.getComponent(SicBoTicketDetailItem);
            ticketDetailItemComponent.updateContent(betLogDetail, this.settlementResult);
            this.content.addChild(ticketDetailItem);
        }
    }
}
