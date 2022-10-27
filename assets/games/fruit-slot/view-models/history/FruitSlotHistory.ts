import BetHistory from "../../../_new/common/BetHistory";
import FruitSlotHistoryItem from "./FruitSlotHistoryItem";

const { ccclass, property } = cc._decorator;

export interface FruitSlotBetLogDetail {
    amount: number;
    choice: string;
    time: number;
    subChoices: string[];
}

export interface FruitSlotOdds {
    bar: number;
    tripleSeven: number;
    watermelon: number;
    star: number;
    bell: number;
    orange: number;
    lemon: number;
    cherry: number;
    big: number;
    small: number;
    bar25: number;
    tripleSeven3: number;
    watermelon3: number;
    star3: number;
    bell3: number;
    orange3: number;
    lemon3: number;
    cherry3: number;
    bar50: number;
}

export interface FruitSlotSettlementResult {
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
}
export interface BetLog {
    time: Date;
    phien: number;
    result: {
        symbols: string[];
        number: number;
        isLucky: boolean;
    };
    totalAmount: number;
    odds: FruitSlotOdds;
    betwin: number;
    betLogDetails: FruitSlotBetLogDetail;
    settlementResult: FruitSlotSettlementResult;
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
