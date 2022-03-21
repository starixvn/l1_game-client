import { CardModel } from "../texas-type";
import TexasEventHandler from "./texas-event-handler";

export type TexasSwap = {
    swap: {
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

export default class TexasSwapHandler<Choices> extends TexasEventHandler<TexasSwap, Choices> {
    protected verifyEvent(event: TexasSwap) {
        return !!event.swap;
    }

    protected handle(event: TexasSwap) {
        const { player, combinationResult, roundId } = event.swap;
        this.gameData.stateModel.swapping();
        this.gameData.swapModel.changeDataAfterSwap(player, combinationResult, roundId);
    }
}
