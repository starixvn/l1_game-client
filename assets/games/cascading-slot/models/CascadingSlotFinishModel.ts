import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export interface Settlement {
    explode: string;
    new: string;
}

export interface Tumble {
    icons: any;
    win: number;
    settlement: Settlement;
    result: string;
}

export interface CascadingSlotFinishData {
    roundId: number;
    result: string;

    win: number;
    bigWin: boolean;
    freeSpins: number;

    tumbles: Tumble[];
}

export class CascadingSlotFinishModel extends EventEmitterBase {
    static Events = {
        SETTLE: "finish:settle"
    };

    data: CascadingSlotFinishData;

    setData(data: CascadingSlotFinishData) {
        this.data = data;

        this.emit(CascadingSlotFinishModel.Events.SETTLE, data);
    }
}
