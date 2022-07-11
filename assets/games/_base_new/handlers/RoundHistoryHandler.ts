import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import NewGameData from "../models/NewGameData";

export type RoundHistoryType = {
    roundHistory: any;
};

export class RoundHistoryHandler extends BaseEventHandler<RoundHistoryType> {
    protected readonly gameData: NewGameData;
    protected verifyEvent(event: RoundHistoryType) {
        return event.roundHistory != null;
    }

    protected handle(event: RoundHistoryType) {
        this.gameData.roundHistory.change(event.roundHistory);
    }
}
