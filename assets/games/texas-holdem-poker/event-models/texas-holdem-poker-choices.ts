export default class TexasHoldemPokerChoices {
    anteBet: number;
    callBet: number;
    turnBet: number;
    riverBet: number;
}

export const TexasHoldemPokerChoicesConst = {
    anteBet: "anteBet",
    callBet: "callBet",
    turnBet: "turnBet",
    riverBet: "riverBet",
    checkTurn: "checkTurn",
    checkRiver: "checkRiver",
    fold: "fold"
};

export const BetActionConst = {
    deal: "deal",
    call: "call",
    doubleCall: "doubleCall",
    fold: "fold",
    betTurn: "betTurn",
    checkTurn: "checkTurn",
    betRiver: "betRiver",
    checkRiver: "checkRiver"
};
