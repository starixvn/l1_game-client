import { EventEmitter } from "events";

type Choices = any;

export class TotalBets extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "totalBets:change"
    };

    protected data: Choices;

    update(choices: Choices) {
        this.data = choices;
        this.emit(TotalBets.Events.CHANGE, this.data);
    }
}
