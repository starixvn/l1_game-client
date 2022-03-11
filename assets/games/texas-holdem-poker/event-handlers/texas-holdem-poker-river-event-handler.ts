import { CardModel } from "../texas-type";
import TexasHoldemPokerEventHandler from "./texas-holdem-poker-event-handler";
import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";
import { convertChoices } from "../texas-helper";

export type TexasHoldemRiver = {
    river: {
        dealer: CardModel[];
        communityCards: CardModel[];
        combinationResult: {
            player: {
                id: number;
                combinationCards: CardModel[];
                cards: CardModel[];
            };
            dealer: {
                id: number;
                combinationCards: CardModel[];
                cards: CardModel[];
            };
        };
        choices: Record<string, number>;
        roundId: number;
        totalAmount: number;
    };
};

export default class TexasHoldemPokerRiverEventHandler<Choices> extends TexasHoldemPokerEventHandler<TexasHoldemRiver, Choices> {
    protected verifyEvent(event: TexasHoldemRiver) {
        return !!event.river;
    }

    protected handle(event: TexasHoldemRiver) {
        this.gameData.isProcessingBet = false;
        const { communityCards, combinationResult, totalAmount, dealer, choices } = event.river;

        const choiceProcess = convertChoices({
            ante: choices.ante,
            call: choices.call,
            turn: choices.turn,
            river: choices.river
        });

        this.gameData.placeBetModel.updateTotalBet({ totalBet: totalAmount, choice: choiceProcess });
        this.gameData.riverModel.updateModel(dealer, communityCards, combinationResult, totalAmount);
    }
}
