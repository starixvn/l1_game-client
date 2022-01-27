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
    protected verifyEvent(event: HiLoBetType<Choices>) {
        return !!event.ownBets;
    }

    protected handle(event: HiLoBetType<Choices>) {
        if (event.ownBets.roundId) {
            this.updateResultData(event.ownBets);
        } else {
            this.gameData.stateModel.prepareNewRound();
        }
    }
}
