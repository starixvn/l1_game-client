import BetChips from "../../../common/bet-chips/view-models/BetChips";
import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import FruitSlotGameData from "../event-models/FruitSlotGameData";
import FruitSlot from "../view-models/FruitSlot";
import FruitSlotBetItem from "../view-models/FruitSlotBetItem";
import FruitSlotChips from "../view-models/FruitSlotChips";

export const showPlaceBetChips =
    (
        bettingAreas: FruitSlotBetItem[],
        betChips: BetChips,       
        fruitSlotChips: FruitSlotChips,
        gameData: FruitSlotGameData,
        mainGame: FruitSlot
    ) =>
    ({ currentChoice, currentAmount, totalAmount }) => {
        console.log("showPlaceBetChips");
        const bettingArea = bettingAreas.filter((a) => a.betChoice === currentChoice)[0];
        if (bettingArea && bettingArea.chipNode) {
            //mainGame.playSingleChipsSound();
            fruitSlotChips.flyChipToBetPlace(betChips, bettingArea.chipNode, currentAmount, totalAmount);
        }
    };
