import HiLoEventHandler from "./HiLoEventHandler";

export type HiLoResultType<Choices> = {
    result: {
        roundId: number;
        betwin: number;
        result: Array<Record<string, number>>;
        nextAmounts: { h: number; l: number };
        remainingTime: number;
    };
};

export class HiLoResultHandler<Choices> extends HiLoEventHandler<HiLoResultType<Choices>, Choices> {
    protected verifyEvent(data: HiLoResultType<Choices>) {
        return !!data.result;
    }

    protected handle(data: HiLoResultType<Choices>) {
        this.gameData.mainGame.showProcessingWarning(false);
        this.updateResultData(data.result);
    }
}
