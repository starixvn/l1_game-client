import { OldCardModel } from "../../../../common/new-card/view-models/NewCard";
import SocketIOGameHistoryBase from "../../../_base/view-models/SocketIOGameHistoryBase";
import WinThreeCardsTicketDetail from "./ticket-detail/WinThreeCardsTicketDetail";
import WinThreeCardsHistoryItem from "./WinThreeCardsHistoryItem";

const { ccclass, property } = cc._decorator;
export interface WinThreeCardsOdds {
    dragon: number;
    phoenix: number;
    pair8Plus: number;
    threeOfAKind: number;
    straightFlush: number;
    flush: number;    
    straight: number;
}

export interface WinThreeCardsBetLogDetails {
    amount: number;
    choice: string;
    time: Date;
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

export type WinThreeCardsGameResultData = OldCardModel[];

export interface WinThreeCardResult {
    cardRankId: number;
    cards: any;
    handRankId: number
}

export interface WinThreeCardsResultCards {
    dragon: WinThreeCardResult;
    phoenix: WinThreeCardResult;
}

export interface WinThreeCardsBetData {
    betLogDetails: WinThreeCardsBetLogDetails;
    dragon: number;
    phoenix: number;
    pair8Plus: number;
    threeOfAKind: number;
    straightFlush: number;
    flush: number;    
    straight: number;
    time: string;
    phien: string;
    betwin: number;
    result: WinThreeCardsResultCards;
    settlementResult: WinThreeCardsSettlementResult;
    odds: WinThreeCardsOdds;
}


@ccclass
export default class WinThreeCardsHistory extends SocketIOGameHistoryBase {
    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    bindItemRowData(betLog: any, index: number) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(WinThreeCardsHistoryItem);
        item.setData(betLog);
        item.showTicketDetail = (data) => this.showTicketDetail(data);
        item.showBackground(index % 2 !== 0);
        this.content.addChild(itemNode);
        if (index === 0) {
            item.node.getChildByName("topBorder").active = false;
        }
    }

    showTicketDetail(data: any) {
        const node = cc.instantiate(this.ticketDetailPrefab);
        this.node.addChild(node);

        const item = node.getComponent(WinThreeCardsTicketDetail);
        item.setData(data);
    }
}
