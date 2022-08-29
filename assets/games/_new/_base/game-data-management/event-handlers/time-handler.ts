import { BaseEventHandler } from "./base-handler";

export type TimeEventType = {
    remainingTime: number;
    gameConfigs: any;
};

export class TimeEventHandler extends BaseEventHandler<TimeEventType> {
    verifyEvent(event: TimeEventType) {
        return event.remainingTime != null;
    }

    handle(event: TimeEventType) {
        const { remainingTime } = event;

        if (event.gameConfigs) {
            this.gameData.durations.remaining = remainingTime;
        } else {
            this.gameData.durations.remaining = remainingTime - 1;
        }
        this.gameData.durations.start();

        this.gameData.isUnderMaintenance = false;
    }
}
