import EventEmitterBase from "../../../../../common/emitter/EventEmitterBase";

type Choices = any;

export class TotalBets extends EventEmitterBase {
    static Events = {
        CHANGE: "totalBets:change"
    };

    protected data: Choices;

    update(choices: Choices) {
        this.data = choices;
        this.emit(TotalBets.Events.CHANGE, this.data);
    }

    updateUI() {
        this.emit(TotalBets.Events.CHANGE, this.data);
    }
}
