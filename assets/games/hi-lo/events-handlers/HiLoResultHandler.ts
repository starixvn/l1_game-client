import HiLoEventHandler from "./HiLoEventHandler";
import { HiLoStakeModel } from "../events-models/HiLoStakeModel";

export type HiLoResultType<Choices> = {
    result: {
        betwin: number;
        result: Array<Record<string, number>>;
        nextAmounts: { h: number; l: number };
        remainingTime: number;
    };
};

export class HiLoResultHandler<Choices> extends HiLoEventHandler<HiLoResultType<Choices>, Choices> {
    protected verifyEvent(event: HiLoResultType<Choices>) {
        return !!event.result;
    }

    protected handle(event: HiLoResultType<Choices>) {
        this.gameData.mainGame.showProcessingWarning(false);

        const { betwin, result, nextAmounts, remainingTime } = event.result;
        const nextAmountModel = new HiLoStakeModel();
        nextAmountModel.betWin = betwin;
        nextAmountModel.higherAmount = nextAmounts.h;
        nextAmountModel.lowerAmount = nextAmounts.l;
        const resultCards = result.map((c) => {
            return { rank: c.rank.toString(), suit: c.suit };
        });
        this.gameData.resultModel.change(resultCards, nextAmountModel, remainingTime);
        this.gameData.stateModel.deal();
    }
}
