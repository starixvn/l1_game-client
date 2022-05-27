import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { Odd, FreeSpin } from "../handlers/CascadingSlotConfigHandler";
export type CascadingSlotConfigData = {
    betLevels: number[];
    coinValues: number[];
    betMultiplier: number;
    maxWinPerRound: number;
    odds: {
        freeSpins: FreeSpin;
        symbols: Record<string, Array<Odd>>;
    };
};
export class CascadingSlotConfigModel extends EventEmitterBase {
    static Events = {
        CHANGE: "configs:change"
    };

    data: CascadingSlotConfigData;

    change(data: CascadingSlotConfigData) {
        this.data = data;

        this.emit(CascadingSlotConfigModel.Events.CHANGE, data);
    }
}
