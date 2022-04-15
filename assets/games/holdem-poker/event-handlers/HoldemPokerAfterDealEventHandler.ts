import { HoldemPokerGameData } from "../event-models/HoldemPokerGameData";
import HoldemPokerEventHandler from "./HoldemPokerEventHandler";
import { OldCardModel } from "../../../common/new-card/view-models/NewCard";

export type HoldemPokerAfterDeal = {
    deal: {
        choices: Record<string, number>;
        roundId: number;
        totalAmount: number;
        communityCards: OldCardModel[];
        combinationResult: {
            player: {
                id: number;
                combinationCards: OldCardModel[];
                cards: OldCardModel[];
            };
        };
    };
};

export default class HoldemPokerAfterDealEventHandler<Choices> extends HoldemPokerEventHandler<HoldemPokerAfterDeal, Choices> {
    protected verifyEvent(event: HoldemPokerAfterDeal) {
        return !!event.deal;
    }

    protected handle(event: HoldemPokerAfterDeal) {
        const { roundId, communityCards, combinationResult } = event.deal;
        this.gameData.stateModel.dealing();
        this.gameData.emit(HoldemPokerGameData.Events.CHOICES_RESULT, event.deal.choices);
        const data = { roundId, communityCards, combinationResult };
        this.gameData.roundCounter.change(roundId);
        this.gameData.dealModel.changeDataAfterDeal(data);
    }
}
