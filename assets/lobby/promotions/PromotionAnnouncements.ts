import CommonDialog from "../../common/_base/view-models/CommonDialog";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
import PromotionAnnouncementItem, { PromotionAnnouncementItemEvent } from "./PromotionAnnouncementItem";

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

    public miniPanel: MiniPanel;

    onToggleClick() {
        this.promotionBoard.active = !this.promotionBoard.active;
        this.termConditionBoard.active = !this.termConditionBoard.active;
    }

    onLoad(): void {
        this.dialog.addOnDidHide(() => this.node.destroy());
        this.setData();
    }

    public setData() {
        const promotion = JSON.parse(cc.sys.localStorage.getItem("PROMOTION_NOTIFICATIONS"));
        promotion.forEach((detail) => {
            const node = cc.instantiate(this.promoItemPrefab);
            this.content.addChild(node);
            const item = node.getComponent(PromotionAnnouncementItem);
            if (item) {
                item.miniPanel = this.miniPanel || cc.RedT.MiniPanel;
            }
            item.node.on(PromotionAnnouncementItemEvent.CLOSE_PROMOTIONS, () => this.dialog.closeDialog());
            item.setData(detail, this.miniPanel);
        });
    }
}
