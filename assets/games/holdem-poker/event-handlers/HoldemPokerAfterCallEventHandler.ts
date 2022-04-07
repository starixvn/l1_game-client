import { HoldemPokerCardModel } from "../event-models/HoldemPokerCardModel";
import { CardResult, HoldemPokerCombinationResult } from "../event-models/HoldemPokerCombinationResult";
import HoldemPokerEventHandler from "./HoldemPokerEventHandler";

export type HoldemPokerAfterCall<Choices> = {
    call: {
        choices: Record<string, number>;
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
            isQualified: boolean;
        };
        totalAmount: number;
    };
};

export default class HoldemPokerAfterCallEventHandler<Choices> extends HoldemPokerEventHandler<HoldemPokerAfterCall<Choices>, Choices> {
    protected verifyEvent(event: HoldemPokerAfterCall<Choices>) {
        return !!event.call;
    }

    protected handle(event: HoldemPokerAfterCall<Choices>) {
        const combinationResult = new HoldemPokerCombinationResult();
        const { player, dealer, isQualified } = event.call.combinationResult;
        combinationResult.playerResult = new CardResult();
        combinationResult.playerResult.handResultId = player.id;
        combinationResult.playerResult.combinationCards = player.combinationCards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

        combinationResult.dealerResult = new CardResult();
        combinationResult.dealerResult.handResultId = dealer.id;
        combinationResult.dealerResult.combinationCards = dealer.combinationCards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

        combinationResult.isQualified = isQualified;

        const dealerCards = event.call.dealer.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

        const communityCards = event.call.communityCards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

        const { totalAmount } = event.call;

        this.gameData.callModel.changeDataAfterCall(dealerCards, communityCards, combinationResult, totalAmount);
    }
}
