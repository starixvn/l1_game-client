import BetHistory from "../../_new/common/BetHistory";
import FruitSlotHistoryItem from "./FruitSlotHistoryItem";

const { ccclass, property } = cc._decorator;
export interface BetLog {
    time: Date;
    phien: number;
    result: {
        symbols: any;
        number: any;
    };
    amount: number;
    betwin: number;
    settlementResult: {
        bar: boolean;
        tripleSeven: boolean;
        watermelon: boolean;
        star: boolean;
        bell: boolean;
        orange: boolean;
        lemon: boolean;
        cherry: boolean;
        big: boolean;
        small: boolean;
    };
}

@ccclass
export default class FruitSlotHistory extends BetHistory {
    // @property(cc.Prefab)
    // ticketDetailPrefab: cc.Prefab = null;

    // @property(cc.SpriteFrame)
    // symbols: cc.SpriteFrame[] = [];

    // bindItemRowData(log: any, index: number) {
    //     const historyItemPrefab = cc.instantiate(this.itemPrefab);
    //     const item = historyItemPrefab.getComponent(FruitSlotHistoryItem);
    //     this.content.addChild(historyItemPrefab);
    //     item.setData(log, this.symbols);
    //     this.handleSomeItemRowData(this, item, log);
    // }

    // showTicketDetail(round: number, time: string, result: any, betLogDetails: any, settlementResult: any) {
    //     const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
    //     const ticketDetailComponent = ticketDetailPrefab.getComponent(FruitSlotTicketDetail);
    //     this.node.addChild(ticketDetailPrefab);
    //     ticketDetailComponent.setSicboDetailData(round, result, this.dices);
    //     ticketDetailComponent.setData(betLogDetails, settlementResult);
    //     ticketDetailComponent.showbetLogs();
    // }

    renderTicketHistory(data: any) {
        const betLogs: BetLog[] = data.betLogs;
        betLogs.forEach((log, index) => {
            const historyItemPrefab = cc.instantiate(this.prefabItem);
            const historyControl = historyItemPrefab.getComponent(FruitSlotHistoryItem);
            historyControl.setData(log);
            this.content.addChild(historyItemPrefab);
        });
    }
}
