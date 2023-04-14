import GameUIManager from "../main/view-models/GameUIManager";
import PromotionNotificationsHandler, { PromotionNotificationsEvent } from "./PromotionNotificationsHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromotionNotifications extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    countNode: cc.Node = null;

    isLoadedPromotionAnnouncement = false;
    isReceivedPromotionData = false;

    onLoad(): void {
        PromotionNotificationsHandler.getInstance().on(PromotionNotificationsEvent.NEW_PROMOTION, this.showNotification.bind(this));
        GameUIManager.getInstance().removeEmitterListener(GameUIManager.Events.LOADED_PROMOTION_ANNOUNCEMENT);
        if (GameUIManager.getInstance().prefabCache.miniPanelIcons["promotion"]) {
            this.onLoadedPromotionAnnouncement();
        }
        GameUIManager.getInstance().emitterListener(GameUIManager.Events.LOADED_PROMOTION_ANNOUNCEMENT, () => {
            this.onLoadedPromotionAnnouncement();
        });
    }

    showNotification() {
        const promotion = PromotionNotificationsHandler.getInstance().promotionNotifications;
        if (!this.icon || !this.countNode) {
            return;
        }
        this.icon.active = false;

        if (promotion?.length > 0) {
            this.isReceivedPromotionData = true;
            this.countNode.getChildByName("count").getComponent(cc.Label).string = promotion?.length.toString();
            this.checkToShowNotification();
        }
    }

    onClickNotification() {
        PromotionNotificationsHandler.getInstance().emit(PromotionNotificationsEvent.OPEN_ANNOUNCEMENT);
    }

    private checkToShowNotification() {
        if (!this.icon || !this.isLoadedPromotionAnnouncement || !this.isReceivedPromotionData) {
            return;
        }
        this.icon.active = true;
    }

    private onLoadedPromotionAnnouncement() {
        this.isLoadedPromotionAnnouncement = true;
        this.checkToShowNotification();
    }
}
