import JackpotPoolInfoBase from "./JackpotPoolInfoBase";
import NotificationService from "../../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolInfo extends JackpotPoolInfoBase {
    @property
    loopRequest = true;

    private time = 0;
    private dataKey = "jackpotPools";
    private keyType = `jackpot_pools${this.uuid}`;

    onLoad() {
        NotificationService.getInstance().addDataObserver(this.dataKey, this.keyType, (data: any) => this.onReceivedData(data));
        this.requestData();
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataKey, this.keyType);
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
        NotificationService.getInstance().emitEvent("getPools", {});
    }

    onReceivedData(data: any) {
        this.setData(data);
    }
}
