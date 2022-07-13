const _ = window.modules.lodash;
import { BlockchainBaccaratTotalBetType } from "../event-models/BlockchainBaccaratTotalBetModel";
import BlockchainBaccaratBetItem from "../view-models/BlockchainBaccaratBetItem";

enum ChoicePercent {
    player = "player",
    banker = "banker",
    tie = "tie"
}

export const handlePercentBet =
    (betItems: BlockchainBaccaratBetItem[], isInRoundTime: boolean) => (totalBet: BlockchainBaccaratTotalBetType) => {
        if (isInRoundTime) {
            const bankerBet = totalBet?.banker ?? 0;
            const playerBet = totalBet?.player ?? 0;
            const tie = totalBet?.tie ?? 0;
            const total = _.sum([bankerBet, playerBet, tie]);

            betItems.forEach((item) => {
                switch (item.node.name) {
                    case ChoicePercent.player:
                        item.betPercent.string = `${getPercentChoice(total, playerBet)}%`;
                        break;
                    case ChoicePercent.banker:
                        item.betPercent.string = `${getPercentChoice(total, bankerBet)}%`;
                        break;
                    case ChoicePercent.tie:
                        item.betPercent.string = `${
                            total > 0 ? 100 - (getPercentChoice(total, bankerBet) + getPercentChoice(total, playerBet)) : 0
                        }%`;
                        break;
                    default:
                        break;
                }
            });
        }
    };

export const clearPercentBet = (betItems: BlockchainBaccaratBetItem[]) => {
    betItems.forEach((item) => {
        item?.betPercent && (item.betPercent.string = `0%`);
    });
};

const getPercentChoice = (total: number, value: number) => {
    return total > 0 ? Math.floor((value * 100) / total) : 0;
};
