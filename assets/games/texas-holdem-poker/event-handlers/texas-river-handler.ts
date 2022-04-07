import { CardModel } from "../texas-type";
import TexasEventHandler from "./texas-event-handler";

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

export default class TexasRiverHandler<Choices> extends TexasEventHandler<TexasHoldemRiver, Choices> {
    protected verifyEvent(event: TexasHoldemRiver) {
        return !!event.river;
    }

    protected handle(event: TexasHoldemRiver) {
        this.gameData.isProcessingBet = false;
        const { communityCards, combinationResult, totalAmount, dealer } = event.river;

        this.gameData.riverModel.updateModel(dealer, communityCards, combinationResult, totalAmount);
    }
}
