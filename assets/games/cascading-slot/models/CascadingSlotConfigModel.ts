import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { Odds, FreeSpin } from "../handlers/CascadingSlotConfigHandler";
export type CascadingSlotConfigData = {
    mode: number;
    multiplierBonus: {
        min: number;
        max: number;
    };
    betLevels: number[];
    coinValues: number[];
    betMultiplier: number;
    maxWinPerRound: number;
    oddsByCounts: Record<number, Array<Odds>>;
    freeSpins: FreeSpin;
};
export class CascadingSlotConfigModel extends EventEmitterBase {
    static Events = {
        CHANGE: "configs:change"
    };

    data: CascadingSlotConfigData;

    change(data: CascadingSlotConfigData) {
        this.data = data;

        this.emit(CascadingSlotConfigModel.Events.CHANGE, configs);
    }
}
