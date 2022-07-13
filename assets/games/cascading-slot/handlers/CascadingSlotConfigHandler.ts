import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import { CascadingSlotConfigData } from "../models/CascadingSlotConfigModel";
import CascadingSlotGameData from "../models/CascadingSlotGameData";

export type ConfigsType<Choices> = {
    gameConfigs: CascadingSlotConfigData;
};

export default class CascadingSlotConfigHandler<Choices> extends BaseEventHandler<ConfigsType<Choices>, Choices> {
    protected readonly gameData: CascadingSlotGameData<Choices>;

    protected verifyEvent(data: ConfigsType<Choices>) {
        return !!data.gameConfigs;
    }

    protected handle(event: ConfigsType<Choices>) {
        const configs: CascadingSlotConfigData = event.gameConfigs;
        this.gameData.gameConfig.change(configs);
    }
}
