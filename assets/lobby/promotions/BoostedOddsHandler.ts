import NotificationService from "../../common/auth/NotificationService";
import EventEmitterBase from "../../common/emitter/EventEmitterBase";

export const BoostedOddsEvent = {
    SHOW_BOOSTED_ODDS: "SHOW_BOOSTED_ODDS"
};

export class BoostedOddsHandler extends EventEmitterBase {
    private static instance: BoostedOddsHandler;

    private readonly dataKey = "promotionssfasf";
    public isShowBoostedOdds = true;
    protected boostedOddsInterval: any;
    private readonly timeInterval = 300000;

    public static getInstance(): BoostedOddsHandler {
        if (!this.instance) {
            this.instance = new BoostedOddsHandler();
        }

        return this.instance;
    }

    addDataObserver() {
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.receivedData.bind(this));
    }

    removeDataObserver() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
    }

    receivedData(data) {
        if (data.length != 0 && this.isShowBoostedOdds) {
            this.emit(BoostedOddsEvent.SHOW_BOOSTED_ODDS);
            this.isShowBoostedOdds = false;
            this.setIntervalShowBoostedOdds();
        }
    }

    setIntervalShowBoostedOdds(): void {
        this.boostedOddsInterval && clearInterval(this.boostedOddsInterval);
        this.boostedOddsInterval = setInterval(() => {
            this.isShowBoostedOdds = true;
        }, this.timeInterval);
    }
}
