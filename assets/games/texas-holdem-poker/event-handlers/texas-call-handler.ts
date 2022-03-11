import { CardModel } from "../texas-type";
import TexasEventHandler from "./texas-event-handler";
import { convertChoices } from "../texas-helper";

export type TexasHoldemCall = {
    call: {
        choices: Record<string, number>;
        combinationResult: {
            player: {
                id: number;
                combinationCards: CardModel[];
                cards: CardModel[];
            };
        };
        communityCards: CardModel[];
        totalAmount: number;
        roundId?: number;
    };
};

export default class TexasCallHandler<Choices> extends TexasEventHandler<TexasHoldemCall, Choices> {
    protected verifyEvent(event: TexasHoldemCall) {
        return !!event.call;
    }

    protected handle(event: TexasHoldemCall) {
        const { communityCards, combinationResult, totalAmount, choices } = event.call;

        const choiceProcess = convertChoices({ ante: choices.ante, call: choices.call });
        this.gameData.placeBetModel.updateTotalBet({ totalBet: totalAmount, choice: choiceProcess });

        this.gameData.callModel.changeDataAfterCall(communityCards, combinationResult, totalAmount);
    }
}
