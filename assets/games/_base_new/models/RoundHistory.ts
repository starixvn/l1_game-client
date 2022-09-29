import _ = require("lodash");

import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export class RoundHistory extends EventEmitterBase {
    static Events = {
        FIRST_LOAD: "RoundHistory:FIRST_LOAD",
        CHANGE: "RoundHistory:CHANGE"
    };

    gotIngameData = false;
    roundHistory: any[] = [];
    historySize = 100;

    get lastRoundId() {
        return this.roundHistory[0]?.roundId || 0;
    }

    add(roundHistory: any) {
        this.roundHistory.unshift(roundHistory);
        if (this.roundHistory.length > this.historySize) {
            this.roundHistory.pop();
        }
    }

    update() {
        this.roundHistory && this.emit(RoundHistory.Events.CHANGE, this.roundHistory);
    }

    change(roundHistory: any) {
        this.gotIngameData = true;
        this.roundHistory = _.cloneDeep(roundHistory);
        this.emit(RoundHistory.Events.FIRST_LOAD, this.roundHistory);
        this.emit(RoundHistory.Events.CHANGE, this.roundHistory);
    }

    updateUI() {
        this.emit(RoundHistory.Events.FIRST_LOAD, this.roundHistory);
        this.emit(RoundHistory.Events.CHANGE, this.roundHistory);
    }
}
