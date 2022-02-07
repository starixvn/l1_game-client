import HiLoEventHandler from "./HiLoEventHandler";

export type HiLoBetType<Choices> = {
    ownBets: {
        roundId: number;
        result: Array<Record<string, number>>;
        nextAmounts: { h: number; l: number };
        remainingTime: number;
    };
};

export class HiLoOwnBetHandler<Choices> extends HiLoEventHandler<HiLoBetType<Choices>, Choices> {
    protected verifyEvent(data: HiLoBetType<Choices>) {
        return !!data.ownBets;
    }

    protected handle(data: HiLoBetType<Choices>) {
        if (data.ownBets.roundId) {
            this.updateResultData(data.ownBets);
        } else {
            this.gameData.stateModel.prepareNewRound();
        }
    }
}
