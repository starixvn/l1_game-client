import HoldemPokerMinMaxTable from "../view-models/HoldemPokerMinMaxTable";
import { HoldemPokerConfigs } from "../event-models/HoldemPokerConfigs";
import HoldemPokerAnteOddsTable from "../view-models/HoldemPokerAnteOddsTable";
import HoldemPokerAaOddsTable from "../view-models/HoldemPokerAaOddsTable";

export const updateMinMax = (minMaxTable: HoldemPokerMinMaxTable) => (configs: HoldemPokerConfigs) => {
  minMaxTable.Min = configs.minBet;
  minMaxTable.Max = configs.maxBet;
};

export const updateAnteOdds = (anteOddsTable: HoldemPokerAnteOddsTable) => (configs: HoldemPokerConfigs) => {
  anteOddsTable.RoyalFlush = configs.odds["AnteBet_royalFlush"];
  anteOddsTable.StraightFlush = configs.odds["AnteBet_straightFlush"];
  anteOddsTable.FourOfAKind = configs.odds["AnteBet_fourKind"];
  anteOddsTable.FullHouse = configs.odds["AnteBet_fullHouse"];
  anteOddsTable.Flush = configs.odds["AnteBet_flush"];
  anteOddsTable.StraightOrLower = configs.odds["AnteBet_straight"];
};

export const updateAaOdds = (aaOddsTable: HoldemPokerAaOddsTable) => (configs: HoldemPokerConfigs) => {
  aaOddsTable.RoyalFlush = configs.odds["AABet_royalFlush"];
  aaOddsTable.StraightFlush = configs.odds["AABet_straightFlush"];
  aaOddsTable.FourOfAKind = configs.odds["AABet_fourKind"];
  aaOddsTable.FullHouse = configs.odds["AABet_fullHouse"];
  aaOddsTable.Flush = configs.odds["AABet_flush"];
  aaOddsTable.PairOfAcesOrHigher = configs.odds["AABet_pairAces"];
};
