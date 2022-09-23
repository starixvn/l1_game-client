import { FruitSlotRoundHistory } from "../event-models/FruitSlotRoundHistoryModel";
import FruitSlot from "../view-models/FruitSlot";

export const handleRenderMiniRoundHistoryAndStatistic = (game: FruitSlot) => (roundHistory: FruitSlotRoundHistory[]) => {
    game.miniRoundHistory.render(roundHistory);
    game.statistic.render(roundHistory);
};
