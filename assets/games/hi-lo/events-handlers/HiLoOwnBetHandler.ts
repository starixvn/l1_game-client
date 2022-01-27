import HiLoEventHandler from "./HiLoEventHandler";
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
        this.gameData.mainGame.showProcessingWarning(false);
        const { roundId, result, nextAmounts } = event.ownBets;
        if (roundId && nextAmounts && result) {
            const nextAmountModel = new HiLoStakeModel();
            nextAmountModel.higherAmount = nextAmounts.h;
            nextAmountModel.lowerAmount = nextAmounts.l;
            const resultCards = result.map((c) => {
                return {
                    rank: c.rank.toString(),
                    suit: c.suit
                };
            });
            this.gameData.ownBetModel.change(roundId, resultCards, nextAmountModel);
            this.gameData.stateModel.deal();
        } else {
            this.gameData.stateModel.prepareNewRound();
        }
    }
}
