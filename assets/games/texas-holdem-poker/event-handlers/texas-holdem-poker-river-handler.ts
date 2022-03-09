import { CardModel } from "./../texas-type";
import TexasHoldemPokerEventHandler from "./texas-holdem-poker-event-handler";
import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";

export type TexasHoldemRiver<Choices> = {
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

export default class TexasHoldemRiverEventHandler<Choices> extends TexasHoldemPokerEventHandler<TexasHoldemRiver<Choices>, Choices> {
    protected verifyEvent(event: TexasHoldemRiver<Choices>) {
        return !!event.river;
    }

    protected handle(event: TexasHoldemRiver<Choices>) {
        this.gameData.isProcessingBet = false;
        const { communityCards, combinationResult, totalAmount, dealer } = event.river;

        const choices = new TexasHoldemPokerChoices();
        choices.anteBet = event.river.choices.ante;
        choices.callBet = event.river.choices.call;
        choices.turnBet = event.river.choices.turn;
        choices.riverBet = event.river.choices.river;

        this.gameData.placeBetModel.updateTotalBet({ totalBet: totalAmount, choice: choices });
        this.gameData.riverModel.updateModel(dealer, communityCards, combinationResult, totalAmount);
    }
}
