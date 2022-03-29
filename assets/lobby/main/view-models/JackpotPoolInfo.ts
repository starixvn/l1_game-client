import JackpotPoolInfoBase from "./JackpotPoolInfoBase";
import NotificationService from "../../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolInfo extends JackpotPoolInfoBase {
    @property
    loopRequest = true;

    private time = 0;
    private readonly dataType = "jackpotPools";
    private readonly dataKey = `jackpot_pools${this.uuid}`;
    notificationService: NotificationService;

    onLoad() {
        this.notificationService = NotificationService.getInstance();
        this.notificationService.addDataObserver(this.dataType, this.dataKey, (data: any) => this.onReceivedData(data));
        this.requestData();
    }

    onDestroy() {
        this.notificationService.removeDataObserver(this.dataType, this.dataKey);
    }

    update(dt: number) {
        if (!this.loopRequest) {
            return;
        }
        this.time += dt;
        if (this.time > 5) {
            this.time = 0;
            this.requestData();
        }
    }

    requestData() {
        this.notificationService.emitEvent("getPools", {});
    }

    onReceivedData(data: any) {
        this.setData(data);
    }
}
