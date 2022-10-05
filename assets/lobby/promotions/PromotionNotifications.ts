import PromotionNotificationsHandler, { PromotionNotification, PromotionNotificationsEvent } from "./PromotionNotificationsHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromotionNotifications extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    countNode: cc.Node = null;

    @property(cc.Prefab)
    announcementPrefab: cc.Prefab = null;

    @property(cc.Node)
    announcementContainer: cc.Node = null;

    onLoad(): void {
        PromotionNotificationsHandler.getInstance().on(PromotionNotificationsEvent.NEW_PROMOTION, this.showNotification.bind(this));
    }

    showNotification() {
        const promotion = PromotionNotificationsHandler.getInstance()._promotionNotifications;
        if (!this.icon || !this.countNode) {
            return;
        }
        this.icon.active = false;
        if (promotion?.length > 0) {
            this.countNode.getChildByName("count").getComponent(cc.Label).string = promotion?.length.toString();
            this.icon.active = true;
        }
    }

    onClickNotification() {
        const node = cc.instantiate(this.announcementPrefab);
        this.announcementContainer.addChild(node);
    }
}
