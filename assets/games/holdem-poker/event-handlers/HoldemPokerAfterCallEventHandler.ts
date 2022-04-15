import HoldemPokerEventHandler from "./HoldemPokerEventHandler";
import { OldCardModel } from "../../../common/new-card/view-models/NewCard";

export type HoldemPokerAfterCall<Choices> = {
    call: {
        choices: Record<string, number>;
        dealer: OldCardModel[];
        communityCards: OldCardModel[];
        combinationResult: {
            player: {
                id: number;
                combinationCards: any;
                cards: OldCardModel[];
            };
            dealer: {
                id: number;
                combinationCards: any;
                cards: OldCardModel[];
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
        const { dealer, communityCards, combinationResult, totalAmount } = event.call;
        const covertedData = { communityCards, combinationResult, totalAmount, dealerCards: dealer };
        this.gameData.callModel.changeDataAfterCall(covertedData);
    }
}
