import NotificationService from "../../common/auth/NotificationService";
import EventEmitterBase from "../../common/emitter/EventEmitterBase";

export const PromotionNotificationsEvent = {
    NEW_PROMOTION: "NEW_PROMOTION"
};

export class PromotionNotification {
    displayKind: number;
    enabled: boolean;
    gameId?: number;
    gameName: string;
    _id: string;
    isActive: boolean;
    messages: any;
    promotionId: string;
    time: string;
    title: any;
    endTime: string;
    startTime: string;
}

export default class PromotionNotificationsHandler extends EventEmitterBase {
    private static instance: PromotionNotificationsHandler;

    private readonly dataKey = "promotionNotifications";

    public _reloadAnnouncementPopup = false;

    public _promotionNotifications: PromotionNotification[];

    public static getInstance(): PromotionNotificationsHandler {
        if (!this.instance) {
            this.instance = new PromotionNotificationsHandler();
        }
        return this.instance;
    }

    get reloadAnnouncementPopup() {
        return this._reloadAnnouncementPopup;
    }

    get promotionNotifications() {
        return this._promotionNotifications;
    }

    addDataObserver() {
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.receivedData.bind(this));
    }

    removeDataObserver() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
    }

    receivedData(data: PromotionNotification[]) {
        if (JSON.stringify(this._promotionNotifications) === JSON.stringify(data)) {
            this._reloadAnnouncementPopup = false;
        } else this._reloadAnnouncementPopup = true;
        this._promotionNotifications = data;
        this.emit(PromotionNotificationsEvent.NEW_PROMOTION, data);
    }
}
