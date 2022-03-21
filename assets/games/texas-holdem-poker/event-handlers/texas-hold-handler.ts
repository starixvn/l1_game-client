import { CardModel } from "../texas-type";
import TexasEventHandler from "./texas-event-handler";

export type TexasHold = {
    hold: {
        player: CardModel[];
        combinationResult: {
            player: {
                id: number;
                combinationCards: CardModel[];
                cards: CardModel[];
            };
        };
        roundId: number;
    };
};

export default class TexasHoldHandler<Choices> extends TexasEventHandler<TexasHold, Choices> {
    protected verifyEvent(event: TexasHold) {
        return !!event.hold;
    }

    protected handle(event: TexasHold) {
        const { player, roundId, combinationResult } = event.hold;
        this.gameData.stateModel.holding();
        this.gameData.holdModel.changeDataAfterHold(player, combinationResult, roundId);
    }
}
