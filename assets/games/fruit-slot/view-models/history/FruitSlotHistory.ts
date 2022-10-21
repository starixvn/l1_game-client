import BetHistory from "../../../_new/common/BetHistory";
import FruitSlotHistoryItem from "./FruitSlotHistoryItem";
import FruitSlotTicketDetail from "./FruitSlotTicketDetail";

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
    odds: any;
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

    renderTicketHistory(data: any) {
        const betLogs: BetLog[] = data.betLogs;
        betLogs.forEach((log, index) => {
            const historyItemPrefab = cc.instantiate(this.prefabItem);
            const historyControl = historyItemPrefab.getComponent(FruitSlotHistoryItem);

            historyControl.setData(log, this);
            if (index === 0) {
                historyControl.node.getChildByName("topBorder").active = false;
            }

            this.content.addChild(historyItemPrefab);
        });
    }
}
