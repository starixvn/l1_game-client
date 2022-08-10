import _ = require("lodash");
import NotificationService from "../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Promotions extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    private readonly dataKey = "promotions";
    protected showPromotion: any;

    onLoad(): void {
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.onData.bind(this));
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
        this.showPromotion && clearTimeout(this.showPromotion);
    }

    reset() {
        this.node.active = false;
    }

    onData(data) {
        if (data) {
            this.setPromotion();
        }
    }

    setPromotion(): void {
        this.showPromotion && clearTimeout(this.showPromotion);
        this.showPromotion = setTimeout(function repeat() {
            this.content.active = true;
            this.timeOut = setTimeout(repeat, 15000);
        }, 15000);
    }
}
