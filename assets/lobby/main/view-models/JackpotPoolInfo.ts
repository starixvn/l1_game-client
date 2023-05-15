import { lodash } from "../../../ClientModules";
import NotificationService from "../../../common/auth/NotificationService";
import GameNotification from "./GameNotification";
import JackpotPoolInfoBase from "./JackpotPoolInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolInfo extends JackpotPoolInfoBase {
    @property(GameNotification)
    gameNotification: GameNotification = null;

    @property
    loopRequest = true;

    private time = 0;
    private readonly dataType = "jackpotPools";
    private readonly dataKey = `jackpotPools${this.uuid}`;

    onLoad() {
        NotificationService.getInstance().addDataObserver(this.dataType, this.dataKey, this.onReceivedData.bind(this));
        this.requestData();
    }

    onDestroy() {
        NotificationService.getInstance().removeDataObserver(this.dataType, this.dataKey);
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
        const formattingData = lodash.groupBy(data, "gameId");
        this.setData(formattingData[this.gameNotification.gameId]);
    }
}
