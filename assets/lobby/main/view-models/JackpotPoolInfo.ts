import JackpotPoolInfoBase from "./JackpotPoolInfoBase";
import NotificationService from "../../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolInfo extends JackpotPoolInfoBase {
    @property
    loopRequest = true;

    private time = 0;

    onLoad() {
        NotificationService.getInstance().addDataObserver(`jackpot_pools${this.uuid}`, (data: any) => this.onReceivedData(data));
        this.requestData();
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(`jackpot_pools${this.uuid}`);
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
        if (data.jackpotPools) {
            this.setData(data.jackpotPools);
        }
    }
}
