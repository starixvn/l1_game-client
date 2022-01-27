import HiLoEventHandler from "./HiLoEventHandler";

export type HiLoStatusType<Choices> = {
    status: {
        win: boolean;
        bet: number;
    };
};

export class HiLoStatusHandler<Choices> extends HiLoEventHandler<HiLoStatusType<Choices>, Choices> {
    protected verifyEvent(event: HiLoStatusType<Choices>) {
        return !!event.status;
    }

    protected handle(event: HiLoStatusType<Choices>) {
        this.gameData.mainGame.showProcessingWarning(false);

        const { win, bet } = event.status;

        this.gameData.statusModel.change(win, bet);
        this.gameData.stateModel.collect();
    }
}
