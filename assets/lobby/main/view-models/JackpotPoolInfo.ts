import { uiManager } from "../../../managers/GameUIManager";
import { InternalEvents } from "../../../managers/InternalEvents";
import { JackpotDataKey, JackpotEvents, jackpotManager } from "../../../managers/JackpotManager";
import JackpotPoolInfoBase from "./JackpotPoolInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolInfo extends JackpotPoolInfoBase {
    @property
    gameId = 0;

    protected dataType = JackpotDataKey.JACKPOT_POOLS_ON_GAME;
    protected dataKey = `${JackpotDataKey.JACKPOT_POOLS_ON_GAME}${this.uuid}`;

    onLoad() {
        this.initEvents();
        this.requestData();
        this.schedule(this.requestData, 5);
    }

    onDestroy() {
        jackpotManager.removeDataObserver(this.dataType, this.dataKey);
        uiManager.removeListeners(this.dataType, this.dataKey);
        this.unschedule(this.requestData);
    }

    initEvents() {
        jackpotManager.addDataObserver(this.dataType, this.dataKey);
        uiManager.emitterListener(
            InternalEvents.RECEIVED_JACKPOT_POOLS_ON_GAME,
            (data) => {
                const gamePools = data[this.gameId];
                if (!this.gameId || !gamePools) {
                    return;
                }

                this.setData(gamePools);
            },
            this
        );
    }

    requestData() {
        if (!this.gameId) {
            return;
        }
        jackpotManager.emitEvent(JackpotEvents.GET_POOLS, { gameId: this.gameId });
    }
}
