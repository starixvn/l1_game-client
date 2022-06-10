export type BlockchainBaccaratChoicesType = {
    big: number;
    small: number;
    player: number;
    banker: number;
    playerPair: number;
    bankerPair: number;
    tie: number;
};

export type CardModel = { rank: string; suit: number };
export type CardModelNew = { rank: number; suit: number };

export class CardChain {
    card: CardModel;
    hashValue: string;
    rawValue: string;
    revealedRawValue: string;
}

export type CardValue = {
    card1: CardModel;
    card2: CardModel;
    card3?: CardModel;
};
