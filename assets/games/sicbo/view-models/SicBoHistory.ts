import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import GameHistoryBase from "../../_base/GameHistoryBase";
import NewSocketGameBaseHistory from "../../_base/NewSocketGameBaseHistory";
import SicBoHistoryItem from "./SicBoHistoryItem";
import SicBoTicketDetail from "./SicBoTicketDetail";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SicBoHistory extends NewSocketGameBaseHistory {
    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    dices: cc.SpriteFrame[] = [];

    bindItemRowData(log, index) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent(SicBoHistoryItem);
        this.content.addChild(historyItemPrefab);

        item.timeLabel.string = getStringDateByTime(log.time);
        item.roundLabel.string = log.phien.toString();
        item.dices[0].spriteFrame = this.dices[log.result.dice1 - 1];
        item.dices[1].spriteFrame = this.dices[log.result.dice2 - 1];
        item.dices[2].spriteFrame = this.dices[log.result.dice3 - 1];
        item.total.string = log.result.dice1 + log.result.dice2 + log.result.dice3;

        GameHistoryBase.handleSomeItemRowData(this, item, log);
    }

    showTicketDetail(round: number, time: string, result: any, betLogDetails: any, settlementResult: any) {
        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        const ticketDetailComponent = ticketDetailPrefab.getComponent(SicBoTicketDetail);

        this.node.addChild(ticketDetailPrefab);
        ticketDetailComponent.roundLabel.string = round.toString();
        ticketDetailComponent.dices[0].spriteFrame = this.dices[result.dice1 - 1];
        ticketDetailComponent.dices[1].spriteFrame = this.dices[result.dice2 - 1];
        ticketDetailComponent.dices[2].spriteFrame = this.dices[result.dice3 - 1];
        ticketDetailComponent.total.string = result.dice1 + result.dice2 + result.dice3;
        ticketDetailComponent.setData(betLogDetails, settlementResult);
        ticketDetailComponent.showbetLogs();
    }
}
