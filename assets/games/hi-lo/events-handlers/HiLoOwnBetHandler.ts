import HiLoEventHandler from "./HiLoEventHandler";
import { HiLoCardModel } from "../events-models/HiLoCardModel";
import { HiLoStakeModel } from "../events-models/HiLoStakeModel";

export type HiLoBetType<Choices> = {
    ownBets: {
        roundId: number;
        result: Array<Record<string, number>>;
        nextAmounts: { h: number; l: number };
    };
};

export class HiLoOwnBetHandler<Choices> extends HiLoEventHandler<HiLoBetType<Choices>, Choices> {
    protected verifyEvent(event: HiLoBetType<Choices>) {
        return !!event.ownBets;
    }

    protected handle(event: HiLoBetType<Choices>) {
        const { roundId, result, nextAmounts } = event.ownBets;

        const nextAmountModel = new HiLoStakeModel();
        nextAmountModel.higherAmount = nextAmounts.h;
        nextAmountModel.lowerAmount = nextAmounts.l;
        const resultCards = result.map((c) => new HiLoCardModel(c.rank, c.suit));

        this.gameData.ownBetModel.change(roundId, resultCards, nextAmountModel);
    }
}
