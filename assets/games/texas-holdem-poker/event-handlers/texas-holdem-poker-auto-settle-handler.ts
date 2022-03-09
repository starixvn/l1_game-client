import { CardModel } from "./../texas-type";
import TexasHoldemPokerEventHandler from "./texas-holdem-poker-event-handler";

export type TexasHoldemAutoSettle = {
    autoSettle: {
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
        totalAmount: number;
        step: string;
    };
};

export default class TexasHoldemAutoSettleEventHandler<Choices> extends TexasHoldemPokerEventHandler<TexasHoldemAutoSettle, Choices> {
    protected verifyEvent(event: TexasHoldemAutoSettle) {
        return !!event.autoSettle;
    }

    protected handle(event: TexasHoldemAutoSettle) {
        this.gameData.isProcessingBet = false;
        const { communityCards, combinationResult, totalAmount, dealer, step } = event.autoSettle;

        this.gameData.autoSettleModel.updateModel({
            combinationResult: combinationResult,
            totalAmount: totalAmount,
            step: step,
            dealerCards: dealer,
            communityCards: communityCards
        });
        this.gameData.settlement.waiting = this.gameData.settlement.autoSettle = true;
    }
}
