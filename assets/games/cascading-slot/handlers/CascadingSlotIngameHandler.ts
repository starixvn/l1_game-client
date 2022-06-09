import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import CascadingSlotGameData from "../models/CascadingSlotGameData";
import { SpinButtonState } from "../models/SpinButtonStateModel";

type IngameEventType = {
    totalMultiplier: number;
    freeSpins: { total: number };
};

export class CascadingSlotIngameHandler<Choices> extends BaseEventHandler<IngameEventType, Choices> {
    protected readonly gameData: CascadingSlotGameData<Choices>;
    protected verifyEvent(event: IngameEventType) {
        return !!event.totalMultiplier || !!event.freeSpins;
    }

    protected handle(event: IngameEventType) {
        const { totalMultiplier, freeSpins } = event;
        if (totalMultiplier > 0) {
            this.gameData.uiModel.changeTotalMultiplier(totalMultiplier);
        }
        if (freeSpins && freeSpins.total > 0) {
            this.gameData.uiModel.setFreeSpins(freeSpins.total);
            this.gameData.spinButtonStateModel.change(SpinButtonState.ResumeWithFreeSpin);
        }
    }
}
