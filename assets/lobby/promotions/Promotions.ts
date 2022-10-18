import NotificationService from "../../common/auth/NotificationService";
import EventEmitterBase from "../../common/emitter/EventEmitterBase";

export const PromotionsEvent = {
    SHOW_BOOSTED_ODDS: "SHOW_BOOSTED_ODDS"
};
export class Promotion {
    gameId: number;
    _id: string;
    endDateTime: string;
    isDaily: boolean;
    odds: any;
    startDateTime: string;
    status: string;
    time: string;
}

export const promotion: Promotion = {
    gameId: 0,
    _id: "id",
    endDateTime: "",
    isDaily: false,
    odds: {},
    startDateTime: "",
    status: ",",
    time: ""
};
export class Promotions extends EventEmitterBase {
    private static instance: Promotions;

    private readonly dataKey = "promotions";
    public isShowBoostedOdds = true;
    protected timeout: any;
    private readonly minutesToMillisecond = 60 * 1000;
    private readonly delayTime = 1 * this.minutesToMillisecond;
    protected promotions: Promotion[] = [promotion];
    private offerGames: number[];

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

    receivedData(data: Promotion[]) {
        const offerGames = cc.sys.localStorage.getItem("offerGames");
        if (offerGames) {
            this.offerGames = JSON.parse(offerGames);
        }
        const newPromotions = data.filter((promotion) => this.offerGames?.includes(promotion.gameId));
        if (newPromotions.length > 0) {
            let haveNewPromotion = newPromotions.length > this.promotions.length;
            if (!haveNewPromotion) {
                const filterNewPromotion = newPromotions.filter(
                    (newPromotion) =>
                        !this.promotions.some(
                            (currentPromotion) =>
                                newPromotion._id === currentPromotion._id &&
                                newPromotion.startDateTime === currentPromotion.startDateTime &&
                                newPromotion.endDateTime === currentPromotion.endDateTime
                        )
                );
                haveNewPromotion = filterNewPromotion.length > 0;
            }
            if (haveNewPromotion || this.isShowBoostedOdds) {
                this.emitEvent();
            }

            this.isShowBoostedOdds = false;

            this.promotions = newPromotions;
        }
    }

    emitEvent() {
        this.emit(PromotionsEvent.SHOW_BOOSTED_ODDS);
        this.setTimeoutShowBoostedOdds();
    }

    setTimeoutShowBoostedOdds(): void {
        this.timeout && clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.isShowBoostedOdds = true;
        }, this.delayTime);
    }
}
