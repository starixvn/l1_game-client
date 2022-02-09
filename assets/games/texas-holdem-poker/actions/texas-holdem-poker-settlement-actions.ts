import BetChips from "../../../common/bet-chips/view-models/BetChips";
import TexasHoldemPokerChoices, { TexasHoldemPokerChoicesConst } from "../event-models/texas-holdem-poker-choices";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";
import TexasHoldemPoker from "../view-models/texas-holdem-poker";
import TexasHoldemPokerBettingArea from "../view-models/texas-holdem-poker-betting-area";
import TexasHoldemPokerChips from "../view-models/texas-holdem-poker-chip";

export const showWinningOption =
    (
        bettingAreas: TexasHoldemPokerBettingArea[],
        holdemPokerChips: TexasHoldemPokerChips,
        slidingChips: BetChips,
        gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoices>,
        main: TexasHoldemPoker
    ) =>
    () => {
        holdemPokerChips.showWinningOption(gameData, bettingAreas, slidingChips, main, TexasHoldemPokerChoicesConst);
        gameData.settlement.waiting = false;
    };
