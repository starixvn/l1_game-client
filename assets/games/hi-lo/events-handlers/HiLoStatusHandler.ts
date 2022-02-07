import HiLoEventHandler from "./HiLoEventHandler";

export type HiLoStatusType<Choices> = {
    status: {
        win: boolean;
        bet: number;
    };
};

export class HiLoStatusHandler<Choices> extends HiLoEventHandler<HiLoStatusType<Choices>, Choices> {
    protected verifyEvent(data: HiLoStatusType<Choices>) {
        return !!data.status;
    }

    protected handle(data: HiLoStatusType<Choices>) {
        this.gameData.mainGame.showProcessingWarning(false);

        const { win, bet } = data.status;

        this.gameData.statusModel.change(win, bet);
        this.gameData.stateModel.collect();
    }
}
