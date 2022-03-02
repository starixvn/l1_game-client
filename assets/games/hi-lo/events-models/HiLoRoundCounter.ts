import { EventEmitter } from "events";

const { ccclass, property } = cc._decorator;

export class HiLoRoundCounter extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "roundId:change"
    };

    roundId: number;

    change(roundId: number) {
        this.roundId = roundId;
        this.emit(HiLoRoundCounter.Events.CHANGE, this);
    }
}
