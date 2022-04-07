import BetChips from "../../../common/bet-chips/view-models/BetChips";
import { TexasChoicesType } from "../texas-type";
import TexasGameDataModel from "../event-models/texas-game-data-model";
import Texas from "../view-models/texas";
import TexasBettingArea from "../view-models/texas-betting-area";
import TexasHoldemPokerChip from "../view-models/texas-chips";
import { TexasChoicesConst } from "../texas-constants";

export const showWinningOption =
    (
        bettingAreas: TexasBettingArea[],
        holdemPokerChips: TexasHoldemPokerChip,
        slidingChips: BetChips,
        gameData: TexasGameDataModel<TexasChoicesType>,
        main: Texas
    ) =>
    () => {
        holdemPokerChips.showWinningOption(gameData, bettingAreas, slidingChips, main as any, TexasChoicesConst);
        gameData.settlement.waiting = false;
    };
