import { CardModel } from "../texas-type";
import TexasEventHandler from "./texas-event-handler";

export type TexasHoldemTurn = {
    turn: {
        player: CardModel[];
        communityCards: CardModel[];
        combinationResult: {
            player: {
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

export default class TexasTurnHandler<Choices> extends TexasEventHandler<TexasHoldemTurn, Choices> {
    protected verifyEvent(event: TexasHoldemTurn) {
        return !!event.turn;
    }

    protected handle(event: TexasHoldemTurn) {
        const { communityCards, combinationResult, totalAmount } = event.turn;

        this.gameData.turnModel.updateModel(communityCards, combinationResult, totalAmount);
    }
}
