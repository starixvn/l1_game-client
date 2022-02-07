import HiLoEventHandler from "./HiLoEventHandler";

export type HiLoTurnType<Choices> = {
    bet: {
        roundId: number;
        order: number;
    };
};

export class HiLoTurnHandler<Choices> extends HiLoEventHandler<HiLoTurnType<Choices>, Choices> {
    protected verifyEvent(data: HiLoTurnType<Choices>) {
        return !!data.bet;
    }

    protected handle(data: HiLoTurnType<Choices>) {
        this.gameData.mainGame.showProcessingWarning(false);

        const { roundId, order } = data.bet;

        this.gameData.turnModel.change(roundId, order);
    }
}
