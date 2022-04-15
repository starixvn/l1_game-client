import TexasEventHandler from "./texas-event-handler";
import { OldCardModel } from "../../../common/new-card/view-models/NewCard";

export type TexasHoldemTurn = {
    turn: {
        player: OldCardModel[];
        communityCards: OldCardModel[];
        combinationResult: {
            player: {
                id: number;
                combinationCards: OldCardModel[];
                cards: OldCardModel[];
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
