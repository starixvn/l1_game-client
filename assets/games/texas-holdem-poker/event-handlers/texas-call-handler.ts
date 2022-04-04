import { CardModel } from "../texas-type";
import TexasEventHandler from "./texas-event-handler";

export type TexasHoldemCall = {
    call: {
        choices: Record<string, number>;
        combinationResult: {
            player: {
                id: number;
                combinationCards: CardModel[];
                cards: CardModel[];
            };
        };
        communityCards: CardModel[];
        totalAmount: number;
        roundId?: number;
    };
};

export default class TexasCallHandler<Choices> extends TexasEventHandler<TexasHoldemCall, Choices> {
    protected verifyEvent(event: TexasHoldemCall) {
        return !!event.call;
    }

    protected handle(event: TexasHoldemCall) {
        const { communityCards, combinationResult, totalAmount } = event.call;

        this.gameData.callModel.changeDataAfterCall(communityCards, combinationResult, totalAmount);
    }
}
