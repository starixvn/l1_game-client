import NotificationService from "../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Promotions extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    private readonly dataKey = "promotions";
    public showBoostedOdds = false;
    protected boostedOddsInterval: any;
    private readonly timeInterval = 60000;

    onLoad(): void {
        this.setIntervalShowBoostedOdds();
        NotificationService.getInstance().addDataObserver(this.dataKey, this.dataKey, this.receivedData.bind(this));
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.dataKey);
        this.boostedOddsInterval && clearInterval(this.boostedOddsInterval);
    }

    receivedData(data) {
        if (data && !this.showBoostedOdds) {
            console.log("boosted odds");
            this.handleBoostedOdds();
        }
    }

    handleBoostedOdds() {
        this.showBoostedOdds = true;
        cc.tween(this.content).to(0.2, { opacity: 255 }).delay(5).to(0.1, { opacity: 0 }).start();
    }

    setIntervalShowBoostedOdds(): void {
        this.boostedOddsInterval && clearInterval(this.boostedOddsInterval);
        this.boostedOddsInterval = setInterval(() => {
            this.showBoostedOdds = false;
        }, this.timeInterval);
    }

    onClickBoostedOdds() {}
}
