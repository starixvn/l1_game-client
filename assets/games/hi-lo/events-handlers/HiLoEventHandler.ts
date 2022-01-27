import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import HiLoGameData from "../events-models/HiLoGameData";
import { HiLoStakeModel } from "../events-models/HiLoStakeModel";

export default class HiLoEventHandler<Event, Choices> extends BaseEventHandler<Event, Choices> {
    protected readonly gameData: HiLoGameData<Choices>;

    protected updateResultData(data: any) {
        this.gameData.mainGame.showProcessingWarning(false);
        const { roundId, betwin, result, nextAmounts, remainingTime } = data;
        const nextAmountModel = new HiLoStakeModel();
        betwin && (nextAmountModel.betWin = betwin);
        if (nextAmounts) {
            nextAmountModel.higherAmount = nextAmounts.h;
            nextAmountModel.lowerAmount = nextAmounts.l;
        }

        const resultCards = result.map((c) => {
            return { rank: c.rank.toString(), suit: c.suit };
        });
        this.gameData.resultModel.change(roundId, resultCards, nextAmountModel, remainingTime);
        this.gameData.stateModel.deal();
    }
}
