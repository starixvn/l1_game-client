export type BlockchainBaccaratChoicesType = {
    big: number;
    small: number;
    player: number;
    banker: number;
    playerPair: number;
    bankerPair: number;
    tie: number;
};

export type CardModel = { value: number; suit: number };

export type CardChain = {
    card: CardModel;
    hashValue: string;
    rawValue: string;
    revealedRawValue: string;
};
