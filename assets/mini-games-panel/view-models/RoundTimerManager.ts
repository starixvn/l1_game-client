import NotificationService from "../../common/auth/NotificationService";

export default class RoundTimerManager {
    private static instance: RoundTimerManager;

    public static getInstance(): RoundTimerManager {
        if (!this.instance) {
            this.instance = new RoundTimerManager();
        }

        return this.instance;
    }

    getAllMiniCounter() {
        NotificationService.getInstance().emitEvent("getMiniCounter", {});
    }
}
