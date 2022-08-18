import NotificationService from "../../common/auth/NotificationService";
import PromotionAnnouncements from "./PromotionAnnouncements";

const { ccclass, property } = cc._decorator;

export const BoostedOddsEvent = {
    SHOW_PROMOTION_ANNOUNCEMENT: "SHOW_PROMOTION_ANNOUNCEMENT"
};
@ccclass
export default class Promotions extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    private readonly dataKey = "promotions";

    public promoList: PromotionAnnouncements = null;

    onLoad(): void {
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.receivedData.bind(this));
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
    }

    receivedData(data) {
        if (data.length != 0) {
            console.log("boosted odds");
            this.handleBoostedOdds();
        }
    }

    handleBoostedOdds() {
        cc.tween(this.content).to(0.2, { opacity: 255 }).delay(5).to(0.1, { opacity: 0 }).start();
    }

    onClickBoostedOdds() {
        this.node.emit(BoostedOddsEvent.SHOW_PROMOTION_ANNOUNCEMENT);
        //this.promoList.setData();
    }
}
