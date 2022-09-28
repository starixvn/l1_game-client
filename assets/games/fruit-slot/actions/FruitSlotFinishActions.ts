import { FruitSlotResult, FruitSlotSettlementResult } from "../FruitSlotType";
import FruitSlot from "../view-models/FruitSlot";

type FruitSlotFinishModel = {
    result: FruitSlotResult;
    settlementResult: FruitSlotSettlementResult;
    winningPlayers: any[];
    roundId: number;
};

export const handleShowResult = (game: FruitSlot) => (finish: FruitSlotFinishModel) => {
    game.finishShowResult = false;
    game.gameData.settlement.finishShowResult(finish, true);
};

export const handleAfterSettlementResult =
    (game: FruitSlot) =>
    ({ settlement }: { settlement: FruitSlotFinishModel }) => {
        game.finishShowResult = true;
        game.statistic.addItem(settlement);
        game.miniRoundHistory.addNewItem(settlement);
    };
