import NotificationService from "../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

const PromotionNotificationsStorageKey = "PROMOTION_NOTIFICATIONS";
@ccclass
export default class PromotionNotifications extends cc.Component {
    @property(cc.Label)
    count: cc.Label = null;

    private readonly dataKey = "promotionNotification";

    onLoad(): void {
        this.node.on("click", this.onClickNotification, this);
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.receivedData.bind(this));
        const promotion = JSON.parse(cc.sys.localStorage.getItem(PromotionNotificationsStorageKey));
        console.log("promotions", promotion);
        this.count.string = promotion?.length > 0 ? promotion.length.toString() : "";
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
        this.node.off("click", this.onClickNotification, this);
    }

    receivedData(data) {
        if (data.length != 0) {
            cc.sys.localStorage.setItem(PromotionNotificationsStorageKey, JSON.stringify(data));
            this.count.string = data.length.toString();
        }
    }

    onClickNotification() {}
}
