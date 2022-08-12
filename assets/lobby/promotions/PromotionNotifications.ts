import NotificationService from "../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromotionNotifications extends cc.Component {
    @property(cc.Label)
    count: cc.Label = null;

    private readonly dataKey = "promotionNotification";

    onLoad(): void {
        this.node.on("click", this.onClickNotification, this);
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.receivedData.bind(this));
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
        this.node.off("click", this.onClickNotification, this);
    }

    receivedData(data) {
        if (data.length != 0) {
            console.log("data.length", data.length);
            this.count.string = data.length.toString();
        }
    }

    onClickNotification() {
        this.count.string = "";
    }
}
