import { CardModel, OldCardModel } from "../../../../common/new-card/view-models/NewCard";
import { GameConfigBase } from "../../../_base/view-models/GameConfigBase";

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
    tie: boolean;
}

export type WinThreeCardsGameResultData = OldCardModel[];

export class WinThreeCardResult {
    cards: CardModel[];
    cardRankId: number;
    handRankId: number;

    constructor(cardResult: any) {
        this.cardRankId = cardResult?.cardRankId ?? -1;
        this.handRankId = cardResult?.handRankId ?? -1;
        if (cardResult.cards) {
            this.cards = Object.values(cardResult.cards);
        }
    }
}

export interface WinThreeCardsResultCards {
    dragon: WinThreeCardResult;
    phoenix: WinThreeCardResult;
}

export interface WinThreeCardsBetData {
    freeBet: boolean;
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

export class WinThreeCardsConfigs implements GameConfigBase {
    minBetTime = 1;
    fullTime = 45;
    betTime = 30;
    stopBetTime = 5;
    waitTime = 20;
}

export interface WinThreeCardsRoundHistory {
    result: WinThreeCardsResultCards;
    settlementResult: WinThreeCardsSettlementResult;
    roundId: number;
}
