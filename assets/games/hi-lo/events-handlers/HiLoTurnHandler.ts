import HiLoEventHandler from "./HiLoEventHandler";

export type HiLoTurnType<Choices> = {
    bet: {
        roundId: number;
        order: number;
    };
};

export class HiLoTurnHandler<Choices> extends HiLoEventHandler<HiLoTurnType<Choices>, Choices> {
    protected verifyEvent(event: HiLoTurnType<Choices>) {
        return !!event.bet;
    }

    protected handle(event: HiLoTurnType<Choices>) {
        const { roundId, order } = event.bet;

        this.gameData.turnModel.change(roundId, order);
    }
}
