import FruitSlotChoices from "../event-models/FruitSlotChoices";
import { FruitSlotRoundHistory } from "../event-models/FruitSlotRoundHistoryModel";
import FruitSlot from "../view-models/FruitSlot";
import { lodash as _ } from "../../../ClientModules";
import GameUtils from "../../../common/GameUtils";

export const handleRenderMiniRoundHistoryAndStatistic = (game: FruitSlot) => (roundHistory: FruitSlotRoundHistory[]) => {
    game.miniRoundHistory.render(roundHistory);
    game.statistic.render(roundHistory);
};

export const handleRenderOwnBet = (game: FruitSlot) => (ownBets: FruitSlotChoices) => {
    Object.keys(ownBets).forEach((key) => {
        const betItem = _.find(game.betItems, (item) => item.node.name.toLowerCase() === key.toLowerCase());
        const destNode = betItem.chipNode;
        const chipStack = GameUtils.createChipStack(ownBets[key], game.betChips, game.shadowChip, destNode.skewX);
        destNode.addChild(chipStack);
    });
};
