import { BlockchainBaccaratBetType } from "../event-models/BlockchainBaccaratBetPercentageModel";
import BlockchainBaccaratBetItem from "../view-models/BlockchainBaccaratBetItem";

enum ChoicePercent {
    player = "player",
    banker = "banker",
    tie = "tie"
}

export const handlePercentBet =
    (betItems: BlockchainBaccaratBetItem[], isInRoundTime: boolean) => (betPercentage: BlockchainBaccaratBetType) => {
        if (isInRoundTime) {
            betItems.forEach((item) => {
                switch (item.node.name) {
                    case ChoicePercent.player:
                        item.betPercent.string = `${betPercentage?.player ?? 0}%`;
                        break;
                    case ChoicePercent.banker:
                        item.betPercent.string = `${betPercentage?.banker ?? 0}%`;
                        break;
                    case ChoicePercent.tie:
                        item.betPercent.string = `${betPercentage?.tie ?? 0}%`;
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
