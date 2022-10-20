import BetHistory from "../../_new/common/BetHistory";
import FruitSlotHistoryItem from "./FruitSlotHistoryItem";
import FruitSlotTicketDetail from "./FruitSlotTicketDetail";
import FruitSlotTicketDetailItem from "./FruitSlotTicketDetailItem";

const { ccclass, property } = cc._decorator;
export interface BetLog {
    time: Date;
    phien: number;
    result: {
        symbols: any;
        number: any;
        isLucky: boolean;
    };
    totalAmount: number;
    betwin: number;
    betLogDetails: any;
    settlementResult: {
        bar: boolean;
        tripleSeven: boolean;
        watermelon: boolean;
        star: boolean;
        bell: boolean;
        orange: boolean;
        lemon: boolean;
        cherry: boolean;
        lucky: boolean;
        big: boolean;
        small: boolean;
    };
}
@ccclass
export default class FruitSlotHistory extends BetHistory {
    @property(cc.Node)
    ticketDetailContent: cc.Node;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    symbols: cc.SpriteFrame[] = [];

    openTicketDetail(parentNode: cc.Node, betLog: any, symbolSprites: cc.SpriteFrame[]) {
        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        parentNode.getComponent(FruitSlotHistory).ticketDetailContent.addChild(ticketDetailPrefab);
        const ticketDetailComponent = ticketDetailPrefab.getComponent(FruitSlotTicketDetail);
        ticketDetailComponent.setData(betLog.betLogDetails, betLog.settlementResult);
        ticketDetailComponent.showbetLogs(symbolSprites, betLog.odds, betLog);
    }

    isLastRow(betLogs: any, index: number) {
        return index === betLogs.length - 1;
    }

    renderTicketHistory(data: any) {
        const betLogs: BetLog[] = data.betLogs;
        betLogs.forEach((log, index) => {
            const historyItemPrefab = cc.instantiate(this.prefabItem);
            const historyControl = historyItemPrefab.getComponent(FruitSlotHistoryItem);

            historyControl.setData(log);
            historyControl.openTicketDetail = () => this.openTicketDetail(this.node, log, historyControl.symbolSprites);

            if (this.isLastRow(betLogs, index)) {
                historyControl.node.getChildByName("bottomBorder").active = false;
            }

            this.content.addChild(historyItemPrefab);
        });
    }
}
