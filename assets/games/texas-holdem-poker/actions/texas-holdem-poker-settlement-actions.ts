import BetChips from "../../../common/bet-chips/view-models/BetChips";
import {TexasHoldemPokerChoicesType} from "../texas-type";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";
import TexasHoldemPoker from "../view-models/texas-holdem-poker";
import TexasHoldemPokerBettingArea from "../view-models/texas-holdem-poker-betting-area";
import TexasHoldemPokerChips from "../view-models/texas-holdem-poker-chip";
import { TexasHoldemPokerChoicesConst } from "../contants";

export const showWinningOption =
    (
        bettingAreas: TexasHoldemPokerBettingArea[],
        holdemPokerChips: TexasHoldemPokerChips,
        slidingChips: BetChips,
        gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType>,
        main: TexasHoldemPoker
    ) =>
    () => {
        holdemPokerChips.showWinningOption(gameData, bettingAreas, slidingChips, main as any, TexasHoldemPokerChoicesConst);
        gameData.settlement.waiting = false;
    };
