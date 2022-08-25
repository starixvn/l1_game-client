import NotificationService from "../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

const PromotionNotificationsStorageKey = "PROMOTION_NOTIFICATIONS";
@ccclass
export default class PromotionNotifications extends cc.Component {
    @property(cc.Node)
    countNode: cc.Node = null;

    @property(cc.Prefab)
    announcementPrefab: cc.Prefab = null;

    @property(cc.Node)
    announcementContainer: cc.Node = null;

    private readonly dataKey = "promotionNotifications";

    onLoad(): void {
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.receivedData.bind(this));
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
    }

    receivedData(data) {
        cc.sys.localStorage.setItem(PromotionNotificationsStorageKey, JSON.stringify(data));
        this.countNode.active = false;
        if (data.length > 0) {
            this.countNode.active = true;
            this.countNode.getChildByName("count").getComponent(cc.Label).string = data.length.toString();
        }
    }

    onClickNotification() {
        const node = cc.instantiate(this.announcementPrefab);
        this.announcementContainer.addChild(node);
    }
}
