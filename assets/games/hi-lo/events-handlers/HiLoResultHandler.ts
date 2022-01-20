import HiLoEventHandler from "./HiLoEventHandler";
import { HiLoStakeModel } from "../events-models/HiLoStakeModel";
import { HiLoCardModel } from "../events-models/HiLoCardModel";

export type HiLoResultType<Choices> = {
    result: {
        betWin: number;
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
        const { betWin, result, nextAmounts, remainingTime } = event.result;

        const nextAmountModel = new HiLoStakeModel();
        nextAmountModel.betWin = betWin;
        nextAmountModel.higherAmount = nextAmounts.h;
        nextAmountModel.lowerAmount = nextAmounts.l;
        const resultCards = result.map((c) => new HiLoCardModel(c.rank, c.suit));

        this.gameData.dealModel.changeResult(resultCards, nextAmountModel, remainingTime);
    }
}
