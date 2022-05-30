import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export class HistoryBase<Model> extends EventEmitterBase {
    static Events = {
        CHANGE: "history:change",
        FIFO: "history:fifo"
    };

    protected data: Model[];

    constructor() {
        super();
        this.data = [];
        this.setMaxListeners(0);
    }

    push(...model: Model[]) {
        this.data.push(...model);
        this.dispatchChangeEvent();
    }

    unshift(...model: Model[]) {
        this.data.unshift(...model);
        this.dispatchChangeEvent();
    }

    fifo(model: Model) {
        this.data.unshift(model);
        this.data.pop();
        this.dispatchChangeEvent();
        this.emit(HistoryBase.Events.FIFO, this.list);
    }

    cleanWithoutTriggerEvent() {
        this.data = [];
    }

    get list() {
        return [...this.data];
    }

    protected dispatchChangeEvent() {
        this.emit(HistoryBase.Events.CHANGE, this.list);
    }
}
