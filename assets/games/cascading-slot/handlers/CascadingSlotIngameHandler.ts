import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import CascadingSlotGameData from "../models/CascadingSlotGameData";

type IngameEventType = {
    totalMultiplier: number;
    totalOfFreeSpin: number;
};

export class CascadingSlotIngameHandler<Choices> extends BaseEventHandler<IngameEventType, Choices> {
    protected readonly gameData: CascadingSlotGameData<Choices>;
    protected verifyEvent(event: IngameEventType) {
        return !!event.totalMultiplier;
    }

    protected handle(event: IngameEventType) {
        const { totalMultiplier, totalOfFreeSpin } = event;
        if (totalMultiplier > 0) {
            this.gameData.uiModel.changeTotalMultiplier(totalMultiplier);
        }
        if (totalOfFreeSpin > 0) {
            this.gameData.uiModel.setFreeSpins(totalOfFreeSpin);
        }
    }
}
