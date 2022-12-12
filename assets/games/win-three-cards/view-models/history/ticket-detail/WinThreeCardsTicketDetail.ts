import GameTicketDetailBase from "../../../../_base/view-models/GameTicketDetailBase";
import { WinThreeCardsBetData, WinThreeCardsBetLogDetails, WinThreeCardsOdds, WinThreeCardsSettlementResult  } from "../WinThreeCardsHistory";
import WinThreeCardsHistoryResult from "../WinThreeCardsHistoryResult";
import WinThreeCardsTicketDetailItem from "./WinThreeCardsTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinThreeCardsTicketDetail extends GameTicketDetailBase {
    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property({type: WinThreeCardsHistoryResult})
    cardResultDragon: WinThreeCardsHistoryResult;

    @property({type: WinThreeCardsHistoryResult})
    cardResultPhoenix: WinThreeCardsHistoryResult;

    betLogDetails = null;

    setData(data: WinThreeCardsBetData) {       
        const dragonCards = data.result.dragon;
        const phoenixCards = data.result.phoenix;
        this.round.string = data.phien;
        this.cardResultDragon && this.cardResultDragon.setData(dragonCards);
        this.cardResultPhoenix && this.cardResultPhoenix.setData(phoenixCards);
    }

    public showBetLogs(data: WinThreeCardsBetData) {
        this.betLogDetails = data.betLogDetails;
        this.node.active = true;

        this.betLogDetails.forEach((betLogDetail: WinThreeCardsBetLogDetails, index: number) => {
            this.builTicketDetailRow(data.freeBet, betLogDetail, index, data.odds, data.settlementResult);
        })
    }

    private builTicketDetailRow(freeBet: boolean, betLogDetail: WinThreeCardsBetLogDetails, index: number, odds: WinThreeCardsOdds, settlementResult: WinThreeCardsSettlementResult) {
        const ticketDetailItem = cc.instantiate(this.ticketDetailItemPrefab);
        const ticketDetailItemComponent = ticketDetailItem.getComponent(WinThreeCardsTicketDetailItem);
        if (index === 0) {
            ticketDetailItemComponent.node.getChildByName("topBorder").active = false;
        }
        this.content.addChild(ticketDetailItem);        
        ticketDetailItemComponent.updateContent(freeBet, betLogDetail, odds, settlementResult , index);
    }
}
