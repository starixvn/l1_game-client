import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import { CascadingSlotFinishData } from "../models/CascadingSlotFinishModel";
import CascadingSlotGameData from "../models/CascadingSlotGameData";

export type FinishEventType<Choices> = {
    finish: CascadingSlotFinishData;
};

export default class CascadingSlotFinishHandler<Choices> extends BaseEventHandler<FinishEventType<Choices>, Choices> {
    protected readonly gameData: CascadingSlotGameData<Choices>;

    protected verifyEvent(data: FinishEventType<Choices>) {
        return !!data.finish;
    }

    protected handle(data: FinishEventType<Choices>) {
        this.gameData.finishModel.setData(data.finish);
    }
}
