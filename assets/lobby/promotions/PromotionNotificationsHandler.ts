import NotificationService from "../../common/auth/NotificationService";
import EventEmitterBase from "../../common/emitter/EventEmitterBase";

export const PromotionNotificationsEvent = {
    NEW_PROMOTION: "NEW_PROMOTION",
    OPEN_ANNOUNCEMENT: "OPEN_ANNOUNCEMENT"
};

export class PromotionNotification {
    displayKind: number;
    enabled: boolean;
    gameId: number;
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

    public _joinGameId: number;

    public _promotionNotifications: PromotionNotification[];

    private offerGames: number[];

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

    get joinGameId() {
        return this._joinGameId;
    }

    setJoinGameId(gameId: number) {
        this._joinGameId = gameId;
    }

    addDataObserver() {
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.receivedData.bind(this));
    }

    removeDataObserver() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
    }

    receivedData(data: PromotionNotification[]) {
        const offerGamesStorage = cc.sys.localStorage.getItem("offerGames");
        if (offerGamesStorage) {
            this.offerGames = JSON.parse(offerGamesStorage);
        }
        const newPromotionNotification = data.filter((promotionNotification) => this.offerGames?.includes(promotionNotification.gameId));
        if (JSON.stringify(this._promotionNotifications) === JSON.stringify(newPromotionNotification)) {
            this._reloadAnnouncementPopup = false;
        } else {
            this._reloadAnnouncementPopup = true;
        }
        this._promotionNotifications = newPromotionNotification;
        this.emit(PromotionNotificationsEvent.NEW_PROMOTION, this._promotionNotifications);
    }
}
