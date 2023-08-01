import NotificationService from "../../common/auth/NotificationService";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";

export default class RoundTimerManager {
    private static instance: RoundTimerManager;
    private readonly miniCounter = "miniCounter";
    private readonly latestMiniCounter = "latestMiniCounter";
    public roundData = null;

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
        NotificationService.getInstance().addDataObserver(this.miniCounter, this.miniCounter, this.onReceivedData.bind(this));
        NotificationService.getInstance().addDataObserver(this.latestMiniCounter, this.latestMiniCounter, this.onReceivedData.bind(this));
    }

    onReceivedData(data) {
        this.roundData = data;
        uiManager.emitter.emit(InternalEvents.MINI_GAME_ROUND_TIMER, data);
    }

    removeEvents() {
        NotificationService.getInstance().removeDataObserver(this.miniCounter, this.miniCounter);
        NotificationService.getInstance().removeDataObserver(this.latestMiniCounter, this.latestMiniCounter);
    }
}
