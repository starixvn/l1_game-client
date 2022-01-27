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
    protected verifyEvent(event: HiLoResultType<Choices>) {
        return !!event.result;
    }

    protected handle(event: HiLoResultType<Choices>) {
        this.gameData.mainGame.showProcessingWarning(false);
        this.updateResultData(event.result);
    }
}
