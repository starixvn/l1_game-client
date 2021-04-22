import { CardModel } from "../../../common/new-card/view-models/NewCard";

export type ThreeCardsResultData = string[];

export type ThreeCardsGameResultData = CardModel[];

export interface ThreeCardsSettlementResultData {
    red: boolean;
    black: boolean;
    diamond: boolean;
    heart: boolean;
    club: boolean;
    spade: boolean;
}

export interface ThreeCardsBetData {
    red: number;
    black: number;
    diamond: number;
    heart: number;
    club: number;
    spade: number;
}

export interface ThreeCardsRoundData {
    result: ThreeCardsGameResultData;
    settlementResult: ThreeCardsSettlementResultData;
    roundId: number;
}
