import CommonDialog from "../../common/_base/view-models/CommonDialog";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
import PromotionAnnouncementItem, { PromotionAnnouncementItemEvent } from "./PromotionAnnouncementItem";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import PromotionNotificationsHandler, { PromotionNotificationsEvent } from "./PromotionNotificationsHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromotionAnnouncements extends cc.Component {
    @property(cc.Node)
    termConditionBoard: cc.Node = null;

    @property(cc.Node)
    promotionBoard: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    promoItemPrefab: cc.Prefab = null;

    @property(CommonDialog)
    dialog: CommonDialog = null;

    @property(cc.Label)
    count: cc.Label = null;

    @property(cc.Label)
    promoHeader: cc.Label = null;

    @property(cc.Label)
    termHeader: cc.Label = null;

    @property(cc.Label)
    text: cc.Label = null;

    public miniPanel: MiniPanel;
    public announcementItems: cc.Node[] = [];

    onPromotionClick() {
        this.onPromotionTab(true);
    }

    onTermClick() {
        this.onPromotionTab(false);
    }

    onPromotionTab(enabled: boolean) {
        this.termHeader.node.color = enabled ? cc.Color.WHITE : cc.color(254, 246, 0);
        this.promoHeader.node.color = enabled ? cc.color(254, 246, 0) : cc.Color.WHITE;
        this.promotionBoard.active = enabled;
        this.termConditionBoard.active = !enabled;
        this.promoHeader.node.getComponent(cc.LabelShadow).enabled = enabled;
        this.termHeader.node.getComponent(cc.LabelShadow).enabled = !enabled;
    }

    onLoad(): void {
        PromotionNotificationsHandler.getInstance().on(PromotionNotificationsEvent.NEW_PROMOTION, this.setData.bind(this));
        this.dialog.addOnDidHide(() => this.node.destroy());
        this.setData();
    }

    onDestroy() {
        PromotionNotificationsHandler.getInstance().removeAllListeners();
    }

    public setData() {
        const promotion = JSON.parse(cc.sys.localStorage.getItem("PROMOTION_NOTIFICATIONS"));
        if (promotion.length < 1) {
            this.text.string = i18n.t("promotions.notPromotion");
        } else {
            this.announcementItems?.forEach((item) => item.destroy());
            this.announcementItems = [];
            this.count.string = promotion.length.toString();
            this.count.node.parent.active = true;
            promotion.forEach((detail) => {
                const node = cc.instantiate(this.promoItemPrefab);
                this.content.addChild(node);
                const item = node.getComponent(PromotionAnnouncementItem);
                if (item) {
                    item.miniPanel = this.miniPanel || cc.RedT.MiniPanel;
                }
                item.node.on(PromotionAnnouncementItemEvent.CLOSE_PROMOTIONS, () => this.dialog.closeDialog());
                item.setData(detail);
                this.announcementItems.push(node);
            });
        }
    }
}
