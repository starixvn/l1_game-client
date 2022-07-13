import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import NewGameData from "../models/NewGameData";

export type SettlementType = {
    finish: any;
};

export class SettlemenHandler extends BaseEventHandler<SettlementType> {
    protected readonly gameData: NewGameData;
    protected verifyEvent(event: SettlementType) {
        return event.finish != null;
    }

    protected handle(event: SettlementType) {
        this.gameData.settlement.showResult(event.finish);
    }
}
