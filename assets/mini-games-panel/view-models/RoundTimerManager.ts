import NotificationService from "../../common/auth/NotificationService";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";

export const RoundTimerEvents = {
    ROUND_TIMER: "roundTimer",
    LATEST_ROUND_TIMER: "latestRoundTimer",
    GET_ROUND_TIMER: "getRoundTimer"
};

export default class RoundTimerManager {
    private static instance: RoundTimerManager;
    private readonly roundTimer = "roundTimer";
    private readonly latestRoundTimer = "latestRoundTimer";
    public roundData = null;

    public static getInstance(): RoundTimerManager {
        if (!this.instance) {
            this.instance = new RoundTimerManager();
        }

        return this.instance;
    }

    requestAllGamesRoundTimer() {
        NotificationService.getInstance().emitEvent(RoundTimerEvents.GET_ROUND_TIMER, {});
    }

    initEvents() {
        NotificationService.getInstance().addDataObserver(RoundTimerEvents.ROUND_TIMER, this.roundTimer, this.onReceivedData.bind(this));
        NotificationService.getInstance().addDataObserver(
            RoundTimerEvents.LATEST_ROUND_TIMER,
            this.latestRoundTimer,
            this.onReceivedData.bind(this)
        );
    }

    onReceivedData(data) {
        this.roundData = data;
        uiManager.emitter.emit(InternalEvents.RECEIVED_ROUND_TIMER, data);
    }

    removeEvents() {
        NotificationService.getInstance().removeDataObserver(this.roundTimer, this.roundTimer);
        NotificationService.getInstance().removeDataObserver(this.latestRoundTimer, this.latestRoundTimer);
    }
}
