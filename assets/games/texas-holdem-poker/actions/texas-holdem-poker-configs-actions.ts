import TexasHoldemPokerConfigs from "../event-models/texas-holdem-poker-configs";
import TexasHoldemPokerMinMaxTable from "../view-models/texas-holdem-poker-min-max-table";
import TexasHoldemPokerOddsTable from "../view-models/texas-holdem-poker-odds-table";

export const updateMinMax = (minMaxTable: TexasHoldemPokerMinMaxTable) => (configs: TexasHoldemPokerConfigs) => {
    minMaxTable.Min = configs.minBet;
    minMaxTable.Max = configs.maxBet;
};

export const updateRightOddsTable = (oddsTable: TexasHoldemPokerOddsTable) => (configs: TexasHoldemPokerConfigs) => {
    oddsTable.oddOptions.forEach((e) => (e.OddValue = configs.odds["call"]));
};

export const updateLeftOddsTable = (oddsTable: TexasHoldemPokerOddsTable) => (configs: TexasHoldemPokerConfigs) => {
    for (const [key, value] of Object.entries(configs.odds)) {
        const oddOption = oddsTable.oddOptions.find((e) => e.key === key);
        if (oddOption) oddOption.OddValue = value;
    }
};
