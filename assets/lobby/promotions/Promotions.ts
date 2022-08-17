import NotificationService from "../../common/auth/NotificationService";
import PromotionAnnouncements from "./PromotionAnnouncements";

const { ccclass, property } = cc._decorator;

export const BoostedOddsEvent = {
    SHOW_PROMOTION_ANNOUNCEMENT: "SHOW_PROMOTION_ANNOUNCEMENT"
};

const PromotionStorageKey = "PROMOTION";
const ShowBoostedOddsStorageKey = "SHOW_BOOSTED_ODDS";
@ccclass
export default class Promotions extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    private readonly dataKey = "promotions";
    public isShowBoostedOdds: boolean;
    protected boostedOddsInterval: any;
    private readonly timeInterval = 300000;

    public promoList: PromotionAnnouncements = null;

    onLoad(): void {
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.receivedData.bind(this));
        const promotionNotifications = JSON.parse(cc.sys.localStorage.getItem(PromotionStorageKey));
        console.log("promotions", promotionNotifications);
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
        this.boostedOddsInterval && clearInterval(this.boostedOddsInterval);
    }

    receivedData(data) {
        const test = !cc.sys.localStorage.getItem(ShowBoostedOddsStorageKey);
        this.isShowBoostedOdds = test == null ? true : test;
        console.log("this.isShowBoostedOdds odds", this.isShowBoostedOdds);
        if (data.length != 0 && this.isShowBoostedOdds) {
            console.log("boosted odds");
            cc.sys.localStorage.setItem(PromotionStorageKey, JSON.stringify(data));
            this.handleBoostedOdds();
            this.setIntervalShowBoostedOdds();
        }
    }

    handleBoostedOdds() {
        cc.sys.localStorage.setItem(ShowBoostedOddsStorageKey, false);
        cc.tween(this.content).to(0.2, { opacity: 255 }).delay(5).to(0.1, { opacity: 0 }).start();
    }

    setIntervalShowBoostedOdds(): void {
        this.boostedOddsInterval && clearInterval(this.boostedOddsInterval);
        this.boostedOddsInterval = setInterval(() => {
            cc.sys.localStorage.setItem(ShowBoostedOddsStorageKey, true);
        }, this.timeInterval);
    }

    onClickBoostedOdds() {
        this.node.emit(BoostedOddsEvent.SHOW_PROMOTION_ANNOUNCEMENT);
        //this.promoList.setData();
    }
}
