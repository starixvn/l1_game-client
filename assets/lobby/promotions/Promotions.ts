import NotificationService from "../../common/auth/NotificationService";
import EventEmitterBase from "../../common/emitter/EventEmitterBase";

export const PromotionsEvent = {
    SHOW_BOOSTED_ODDS: "SHOW_BOOSTED_ODDS"
};

export class Promotions extends EventEmitterBase {
    private static instance: Promotions;

    private readonly dataKey = "promotions";
    public isShowBoostedOdds = true;
    protected timeout: any;
    private readonly minutesToMillisecond = 60 * 1000;
    private readonly delayTime = 15 * this.minutesToMillisecond;

    public static getInstance(): Promotions {
        if (!this.instance) {
            this.instance = new Promotions();
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
        if (data.length > 0 && this.isShowBoostedOdds) {
            console.log("BoostedOddsEvent");
            this.emit(PromotionsEvent.SHOW_BOOSTED_ODDS);
            this.isShowBoostedOdds = false;
            this.setTimeoutShowBoostedOdds();
        }
    }

    setTimeoutShowBoostedOdds(): void {
        this.timeout && clearInterval(this.timeout);
        this.timeout = setTimeout(() => {
            this.isShowBoostedOdds = true;
        }, this.delayTime);
    }
}
