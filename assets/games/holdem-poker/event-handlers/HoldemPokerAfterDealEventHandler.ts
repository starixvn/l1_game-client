import { HoldemPokerCardModel } from "../event-models/HoldemPokerCardModel";
import { CardResult, HoldemPokerCombinationResult } from "../event-models/HoldemPokerCombinationResult";
import { HoldemPokerGameData } from "../event-models/HoldemPokerGameData";
import HoldemPokerEventHandler from "./HoldemPokerEventHandler";

export type HoldemPokerAfterDeal<Choices> = {
    deal: {
        player: Array<Record<string, number>>;
        communityCards: Array<Record<string, number>>;
        combinationResult: {
            player: {
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

export default class HoldemPokerAfterDealEventHandler<Choices> extends HoldemPokerEventHandler<HoldemPokerAfterDeal<Choices>, Choices> {
    protected verifyEvent(event: HoldemPokerAfterDeal<Choices>) {
        return !!event.deal;
    }

    protected handle(event: HoldemPokerAfterDeal<Choices>) {
        const combinationResult = new HoldemPokerCombinationResult();
        const { player } = event.deal.combinationResult;
        const { id, combinationCards } = player;
        combinationResult.playerResult = new CardResult();
        combinationResult.playerResult.handResultId = id;
        combinationResult.playerResult.combinationCards = combinationCards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

        const playerCards = event.deal.player.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

        const communityCards = event.deal.communityCards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

        const { roundId, totalAmount } = event.deal;

        this.gameData.stateModel.dealing();
        this.gameData.emit(HoldemPokerGameData.Events.CHOICES_RESULT, event.deal.choices);
        this.gameData.dealModel.changeDataAfterDeal(playerCards, communityCards, combinationResult, roundId, totalAmount);
    }
}
