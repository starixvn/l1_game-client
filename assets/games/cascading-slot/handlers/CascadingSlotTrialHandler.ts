import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import CascadingSlotGameData from "../models/CascadingSlotGameData";

type TrialEventType = {
    trialUser: { balance: number };
    gameConfigs?: any;
    finish?: any;
};

export class CascadingSlotTrialHandler<Choices> extends BaseEventHandler<TrialEventType, Choices> {
    protected readonly gameData: CascadingSlotGameData<Choices>;

    protected verifyEvent(data: TrialEventType) {
        return !!data.trialUser;
    }

    protected handle(data: TrialEventType) {
        if (!!data.gameConfigs) {
            this.gameData.trialModel.setUserBalance(data.trialUser.balance);
        }

        if (!!data.finish) {
            this.gameData.trialModel.cacheSettledBalance(data.trialUser.balance);
        }
    }
}
