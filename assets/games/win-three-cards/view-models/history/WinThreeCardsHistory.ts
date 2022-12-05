import SocketIOGameHistoryBase from "../../../_base/view-models/SocketIOGameHistoryBase";
import WinThreeCardsHistoryItem from "./WinThreeCardsHistoryItem";

const { ccclass, property } = cc._decorator;

export interface WinThreeCardBetLogDetail {
    amount: number;
    choice: string;
}

export interface WinThreeCardsOdds {
    dragon: number;
    phoenix: number;
    pair8Plus: number;
    threeOfAKind: number;
    straightFlush: number;
    flush: number;    
    straight: number;
}

export interface WinThreeCardsSettlementResult {
    dragon: boolean;   
    flush: boolean;
    highCard: boolean;
    killer235: boolean;
    pair: boolean;
    pair8Plus: boolean;
    phoenix: boolean;
    straight: boolean;
    straightFlush: boolean;
    threeOfAKind: boolean;
    tie: boolean
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
    odds: WinThreeCardsOdds;
    betwin: number;
    betLogDetails: WinThreeCardBetLogDetail;
    settlementResult: WinThreeCardsSettlementResult;
}
@ccclass
export default class WinThreeCardsHistory extends SocketIOGameHistoryBase {
    bindItemRowData(betLog: any, index: number) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent(WinThreeCardsHistoryItem);
        this.node.active = true;
        this.content.addChild(historyItemPrefab);
        item.setData(betLog, index);
    }
}
