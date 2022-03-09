import { CardModel } from './../texas-type';
import TexasHoldemPokerEventHandler from "./texas-holdem-poker-event-handler";
import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";

export type TexasHoldemCall<Choices> = {
    call: {
        player:  CardModel[];
        communityCards:  CardModel[];
        combinationResult: {
            player: {
                id: number;
                combinationCards:  CardModel[];
                cards:  CardModel[];
            };
        };
        choices: Record<string, number>;
        roundId: number;
        totalAmount: number;
    };
};

export default class TexasHoldemCallEventHandler<Choices> extends TexasHoldemPokerEventHandler<TexasHoldemCall<Choices>, Choices> {
    protected verifyEvent(event: TexasHoldemCall<Choices>) {
        return !!event.call;
    }

    protected handle(event: TexasHoldemCall<Choices>) {
        const { communityCards, combinationResult, totalAmount } = event.call;
        const convertedCommunityCards = communityCards.map((e) => {
            return { rank: e.rank, suit: e.suit };
        });

        const choices = new TexasHoldemPokerChoices();
        choices.anteBet = event.call.choices.ante;
        choices.callBet = event.call.choices.call;
        this.gameData.placeBetModel.updateTotalBet({ totalBet: totalAmount, choice: choices });

        this.gameData.callModel.changeDataAfterCall(convertedCommunityCards, combinationResult, totalAmount);
    }
}
