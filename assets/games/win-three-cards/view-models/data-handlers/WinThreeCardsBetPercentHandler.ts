import DataHandler from "../../../_base/handlers/DataHandler";
import WinThreeCardBetItem from "../WinThreeCardBetItem";
import WinThreeCards from "../WinThreeCards";
import { Choices } from "../WinThreeCardsConstant";

export default class WinThreeCardsBetPercentHandler implements DataHandler {
    constructor(protected readonly main: WinThreeCards) {}

    handle(data: any) {
        if (data.betPercentage) {
            const { betPercentage } = data;

            this.main.betItems.forEach((item) => {
                switch (item.node.name) {
                    case Choices.dragon:
                        item.betPercent.string = `${Math.round(betPercentage?.dragon ?? 0)}%`;
                        break;
                    case Choices.phoenix:
                        item.betPercent.string = `${Math.round(betPercentage?.phoenix ?? 0)}%`;
                        break;
                    default:
                        break;
                }
            });
        }
    }
}

export const clearPercentBet = (betItems: WinThreeCardBetItem[]) => {
    betItems.forEach((item) => {
        item?.betPercent && (item.betPercent.string = `0%`);
    });
};
