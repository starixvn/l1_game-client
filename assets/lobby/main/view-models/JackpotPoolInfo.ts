import JackpotPoolInfoBase from "./JackpotPoolInfoBase";
import { JackpotDataKey, JackpotEvents, jackpotManager } from "../../../managers/JackpotManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolInfo extends JackpotPoolInfoBase {
    @property
    gameId = 0;

    private readonly dataType = JackpotDataKey.JACKPOT_POOLS;
    private readonly dataKey = `${JackpotDataKey.JACKPOT_POOLS}${this.uuid}`;

    onLoad() {
        jackpotManager.addDataObserver(this.dataType, this.dataKey, this.onReceivedData.bind(this));
        this.requestData();
        this.schedule(this.requestData, 5);
    }

    onDestroy() {
        jackpotManager.removeDataObserver(this.dataType, this.dataKey);
        this.unschedule(this.requestData);
    }

    onReceivedData(data: any) {
        if (!this.gameId) {
            return;
        }
        this.setData(jackpotManager.getJackpotDataWithGameId(data, this.gameId));
    }

    requestData() {
        if (!this.gameId) {
            return;
        }
        jackpotManager.emitEvent(JackpotEvents.GET_POOLS, { gameId: this.gameId });
    }
}
