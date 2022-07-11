import _ = require("lodash");

import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export class RoundHistory extends EventEmitterBase {
    static Events = {
        CHANGE: "RoundHistory:CHANGE"
    };

    protected roundHistory: any[] = [];

    change(roundHistory: any) {
        this.roundHistory = _.cloneDeep(roundHistory);
        this.emit(RoundHistory.Events.CHANGE, this.roundHistory);
    }

    updateUI() {
        this.emit(RoundHistory.Events.CHANGE, this.roundHistory);
    }
}
