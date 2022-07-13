import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export class Settlement extends EventEmitterBase {
    static Events = {
        SHOW_RESULT: "Settlement:SHOW_RESULT",
        END_SHOW_RESULT: "Settlement:END_SHOW_RESULT"
    };
    settlement: any;

    showResult(settlement: any) {
        this.settlement = settlement;
        this.emit(Settlement.Events.SHOW_RESULT, this.settlement);
    }

    finishShowResult(settlement?: any) {
        this.emit(Settlement.Events.END_SHOW_RESULT, this.settlement || settlement);
    }
}
