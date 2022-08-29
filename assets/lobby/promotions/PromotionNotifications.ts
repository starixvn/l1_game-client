import PromotionNotificationsHandler, { PromotionNotificationsEvent } from "./PromotionNotificationsHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromotionNotifications extends cc.Component {
    @property(cc.Node)
    countNode: cc.Node = null;

    @property(cc.Prefab)
    announcementPrefab: cc.Prefab = null;

    @property(cc.Node)
    announcementContainer: cc.Node = null;

    onLoad() {
        PromotionNotificationsHandler.getInstance().on(PromotionNotificationsEvent.NEW_PROMOTION, (data) => {
            this.showNotification(data);
        });
    }

    onDestroy() {
        PromotionNotificationsHandler.getInstance().removeAllListeners();
    }

    showNotification(data) {
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
