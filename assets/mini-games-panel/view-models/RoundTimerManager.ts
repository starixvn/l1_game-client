import NotificationService from "../../common/auth/NotificationService";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";

export default class RoundTimerManager {
    private static instance: RoundTimerManager;

    public static getInstance(): RoundTimerManager {
        if (!this.instance) {
            this.instance = new RoundTimerManager();
        }

        return this.instance;
    }

    requestAllGamesRoundTimer() {
        NotificationService.getInstance().emitEvent("getMiniCounter", {});
    }

    initEvents() {
        NotificationService.getInstance().addDataObserver("miniCounter", "miniCounter", this.onReceivedData.bind(this));
        NotificationService.getInstance().addDataObserver("latestMiniCounter", "latestMiniCounter", this.onReceivedData.bind(this));
    }

    onReceivedData(data) {
        uiManager.emitter.emit(InternalEvents.MINI_ROUND_TIMER, data);
    }
}
