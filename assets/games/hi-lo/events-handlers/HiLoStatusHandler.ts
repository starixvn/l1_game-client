import HiLoEventHandler from "./HiLoEventHandler";

export type HiLoStatusType<Choices> = {
    status: {
        win: boolean;
        bet: number;
    };

    isCollect: number;
};

export class HiLoStatusHandler<Choices> extends HiLoEventHandler<HiLoStatusType<Choices>, Choices> {
    protected verifyEvent(data: HiLoStatusType<Choices>) {
        return !!data.status || !!data.isCollect;
    }

    protected handle(data: HiLoStatusType<Choices>) {
        if (data.status) {
            this.successfulCollect(data.status);
        }

        if (data.isCollect === -1) {
            this.gameData.statusModel.collectFailed();
        }
    }

    private successfulCollect(status: any) {
        const { win, bet } = status;

        this.gameData.statusModel.change(win, bet);
        this.gameData.stateModel.collect();
    }
}
