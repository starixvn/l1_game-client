import BetChips from "../../../common/bet-chips/view-models/BetChips";
import HoldemPokerChoices, { HoldemPokerChoicesConst } from "../event-models/HoldemPokerChoices";
import { HoldemPokerGameData } from "../event-models/HoldemPokerGameData";
import HoldemPoker from "../view-models/HoldemPoker";
import HoldemPokerBettingArea from "../view-models/HoldemPokerBettingArea";
import HoldemPokerChips from "../view-models/HoldemPokerChips";

export const showWinningOption =
    (
        bettingAreas: HoldemPokerBettingArea[],
        holdemPokerChips: HoldemPokerChips,
        betChips: BetChips,
        gameData: HoldemPokerGameData,
        main: HoldemPoker
    ) =>
    () => {
        holdemPokerChips.showWinningOption(gameData, bettingAreas, betChips, main, HoldemPokerChoicesConst);
        gameData.settlement.waiting = false;
    };
