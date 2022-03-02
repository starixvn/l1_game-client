import TexasHoldemPokerHandler from "./texas-holdem-poker-event-handler";
import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";

export type TexasHoldemRiver<Choices> = {
    river: {
        dealer: Array<Record<string, number>>;
        communityCards: Array<Record<string, number>>;
        combinationResult: {
            player: {
                id: number;
                combinationCards: Array<Record<string, number>>;
                cards: Array<Record<string, number>>;
            };
            dealer: {
                id: number;
                combinationCards: Array<Record<string, number>>;
                cards: Array<Record<string, number>>;
            };
        };
        choices: Record<string, number>;
        roundId: number;
        totalAmount: number;
    };
};

export default class TexasHoldemRiverEventHandler<Choices> extends TexasHoldemPokerHandler<TexasHoldemRiver<Choices>, Choices> {
    protected verifyEvent(event: TexasHoldemRiver<Choices>) {
        return !!event.river;
    }

    protected handle(event: TexasHoldemRiver<Choices>) {
        this.gameData.isProcessingBet = false;
        const { communityCards, combinationResult, totalAmount, dealer } = event.river;

        const convertedDealerCard = dealer.map((e) => {
            return { rank: e.rank, suit: e.suit };
        });

        const convertedCommunityCards = communityCards.map((e) => {
            return { rank: e.rank, suit: e.suit };
        });

        const choices = new TexasHoldemPokerChoices();
        choices.anteBet = event.river.choices.ante;
        choices.callBet = event.river.choices.call;
        choices.turnBet = event.river.choices.turn;
        choices.riverBet = event.river.choices.river;

        this.gameData.placeBetModel.updateTotalBet({ totalBet: totalAmount, choice: choices });
        this.gameData.riverModel.updateModel(convertedDealerCard, convertedCommunityCards, combinationResult, totalAmount);
    }
}
