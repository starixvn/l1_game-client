import FruitSlotChoices from "../event-models/FruitSlotChoices";
import FruitSlot from "../view-models/FruitSlot";
import { lodash as _ } from "../../../ClientModules";
import GameUtils from "../../../common/GameUtils";
import { FruitSlotRoundHistory } from "../event-models/FruitSlotRoundHistory";

export const handleRenderMiniRoundHistoryAndStatistic = (game: FruitSlot) => (roundHistory: FruitSlotRoundHistory[]) => {
    game.miniRoundHistory.render(roundHistory);
    game.statistic.render(roundHistory);
};
