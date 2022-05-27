import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import { CascadingSlotConfigData } from "../models/CascadingSlotConfigModel";
import CascadingSlotGameData from "../models/CascadingSlotGameData";

const { ccclass } = cc._decorator;

export type Symbols = {
    symbols: any;
};
export type Odd = {
    from: number;
    to: number;
    odds: number;
};

export type FreeSpin = {
    initialOdds: Array<FreeSpinDetail>;
    additionalOdds: Array<FreeSpinDetail>;
};

type FreeSpinDetail = {
    count: number;
    odds: number;
};

export type ConfigsType<Choices> = {
    gameConfigs: {
        betLevels: number[];
        coinValues: number[];
        betMultiplier: number;
        maxWinPerRound: number;
        odds: {
            freeSpins: FreeSpin;
            symbols: Symbols;
        };
    };
};

@ccclass
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
