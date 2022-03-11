import TexasConfigsModel from "../event-models/texas-configs-model";
import TexasHoldemPokerMinMaxTable from "../view-models/texas-min-max";
import TexasOddsTable from "../view-models/texas-odds-table";

export const updateMinMax = (minMaxTable: TexasHoldemPokerMinMaxTable) => (configs: TexasConfigsModel) => {
    minMaxTable.Min = configs.minBet;
    minMaxTable.Max = configs.maxBet;
};

export const updateRightOddsTable = (oddsTable: TexasOddsTable) => (configs: TexasConfigsModel) => {
    oddsTable.oddOptions.forEach((e) => (e.OddValue = configs.odds["call"]));
};

export const updateLeftOddsTable = (oddsTable: TexasOddsTable) => (configs: TexasConfigsModel) => {
    for (const [key, value] of Object.entries(configs.odds)) {
        const oddOption = oddsTable.oddOptions.find((e) => e.key === key);
        if (oddOption) oddOption.OddValue = value;
    }
};
